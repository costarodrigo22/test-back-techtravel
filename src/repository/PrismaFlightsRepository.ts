import { PrismaClient } from '../generated/prisma';
import { Flight } from '../entities/Flight';
import { IFlightsRepository } from '../interfaces/repositories/IFlightsRepository';

export class PrismaFlightsRepository implements IFlightsRepository {
  private prisma = new PrismaClient();

  async create(flight: Flight): Promise<Flight> {
    const created = await this.prisma.flight.create({
      data: {
        id: flight.id,
        flight_number: flight.flight_number,
        airline_id: flight.airline_id,
        origin_iata: flight.origin_iata,
        destination_iata: flight.destination_iata,
        departure_datetime: flight.departure_datetime,
        arrival_datetime: flight.arrival_datetime,
        frequency: flight.frequency,
      },
    });
    return this.mapPrismaToFlight(created);
  }

  async findById(id: string): Promise<Flight | null> {
    const found = await this.prisma.flight.findUnique({ where: { id } });
    return found ? this.mapPrismaToFlight(found) : null;
  }

  async findAll(filters?: { airline_code?: string; origin?: string; destination?: string }): Promise<Flight[]> {
    const where: any = {};
    if (filters?.airline_code) {
      where.airline = { iata_code: filters.airline_code };
    }
    if (filters?.origin) {
      where.origin_iata = filters.origin;
    }
    if (filters?.destination) {
      where.destination_iata = filters.destination;
    }
    const flights = await this.prisma.flight.findMany({
      where,
    });
    return flights.map(this.mapPrismaToFlight);
  }

  async update(id: string, flight: Partial<Flight>): Promise<Flight | null> {
    const updated = await this.prisma.flight.update({
      where: { id },
      data: flight,
    });
    return updated ? this.mapPrismaToFlight(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.flight.delete({ where: { id } });
  }

  private mapPrismaToFlight(prismaFlight: any): Flight {
    return new Flight(
      prismaFlight.id,
      prismaFlight.flight_number,
      prismaFlight.airline_id,
      prismaFlight.origin_iata,
      prismaFlight.destination_iata,
      prismaFlight.departure_datetime,
      prismaFlight.arrival_datetime,
      prismaFlight.frequency
    );
  }
} 