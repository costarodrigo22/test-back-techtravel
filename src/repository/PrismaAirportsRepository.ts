import { PrismaClient } from '../generated/prisma';
import { Airport } from '../entities/Airport';
import { IAirportsRepository } from '../interfaces/repositories/IAirportsRepository';

export class PrismaAirportsRepository implements IAirportsRepository {
  private prisma = new PrismaClient();

  async create(airport: Airport): Promise<Airport> {
    const created = await this.prisma.airport.create({
      data: {
        id: airport.id,
        name: airport.name,
        iata_code: airport.iata_code,
      },
    });
    return this.mapPrismaToAirport(created);
  }

  async findById(id: string): Promise<Airport | null> {
    const found = await this.prisma.airport.findUnique({ where: { id } });
    return found ? this.mapPrismaToAirport(found) : null;
  }

  async findAll(): Promise<Airport[]> {
    const airports = await this.prisma.airport.findMany();
    return airports.map(this.mapPrismaToAirport);
  }

  async update(id: string, airport: Partial<Airport>): Promise<Airport | null> {
    const updated = await this.prisma.airport.update({
      where: { id },
      data: airport,
    });
    return updated ? this.mapPrismaToAirport(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.airport.delete({ where: { id } });
  }

  private mapPrismaToAirport(prismaAirport: any): Airport {
    return new Airport(
      prismaAirport.id,
      prismaAirport.name,
      prismaAirport.iata_code
    );
  }
} 