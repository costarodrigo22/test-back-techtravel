import { PrismaClient } from '../generated/prisma';
import { Itinerary, ItineraryFlight } from '../entities/Itinerary';
import { IItinerariesRepository } from '../interfaces/repositories/IItinerariesRepository';

export class PrismaItinerariesRepository implements IItinerariesRepository {
  private prisma = new PrismaClient();

  async findAll(): Promise<Itinerary[]> {
    const itineraries = await this.prisma.itinerary.findMany({
      include: {
        flights: {
          include: {
            flight: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });
    return itineraries.map((it: any) => {
      const flightsData: ItineraryFlight[] = it.flights.map((f: any) => ({
        id: f.flight.id,
        flight_number: f.flight.flight_number,
        origin_iata: f.flight.origin_iata,
        destination_iata: f.flight.destination_iata,
        departure_datetime: f.flight.departure_datetime,
        arrival_datetime: f.flight.arrival_datetime,
      }));
      if (flightsData.length === 0) {
        return new Itinerary(it.id, '', '', new Date(), new Date(), 0, 0, []);
      }
      const origin_iata = flightsData[0].origin_iata;
      const destination_iata = flightsData[flightsData.length - 1].destination_iata;
      const departure_datetime = flightsData[0].departure_datetime;
      const arrival_datetime = flightsData[flightsData.length - 1].arrival_datetime;
      const total_duration_minutes = Math.round(
        (arrival_datetime.getTime() - departure_datetime.getTime()) / 60000
      );
      const stops = flightsData.length - 1;
      return new Itinerary(
        it.id,
        origin_iata,
        destination_iata,
        departure_datetime,
        arrival_datetime,
        total_duration_minutes,
        stops,
        flightsData
      );
    });
  }

  async create(flightIds: string[]): Promise<Itinerary> {
    // Cria o itinerário
    const created = await this.prisma.itinerary.create({ data: {} });
    // Cria as relações na tabela ItineraryFlight
    await Promise.all(
      flightIds.map((flightId, idx) =>
        this.prisma.itineraryFlight.create({
          data: {
            itineraryId: created.id,
            flightId,
            order: idx,
          },
        })
      )
    );
    // Busca os voos para consolidar a resposta
    const flights = await this.prisma.flight.findMany({
      where: { id: { in: flightIds } },
      orderBy: [{ departure_datetime: 'asc' }],
    });
    const flightsData: ItineraryFlight[] = flights.map(f => ({
      id: f.id,
      flight_number: f.flight_number,
      origin_iata: f.origin_iata,
      destination_iata: f.destination_iata,
      departure_datetime: f.departure_datetime,
      arrival_datetime: f.arrival_datetime,
    }));
    // Consolidar dados do itinerário
    const origin_iata = flightsData[0].origin_iata;
    const destination_iata = flightsData[flightsData.length - 1].destination_iata;
    const departure_datetime = flightsData[0].departure_datetime;
    const arrival_datetime = flightsData[flightsData.length - 1].arrival_datetime;
    const total_duration_minutes = Math.round(
      (arrival_datetime.getTime() - departure_datetime.getTime()) / 60000
    );
    const stops = flightsData.length - 1;
    return new Itinerary(
      created.id,
      origin_iata,
      destination_iata,
      departure_datetime,
      arrival_datetime,
      total_duration_minutes,
      stops,
      flightsData
    );
  }

  async findById(id: string): Promise<Itinerary | null> {
    const it = await this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        flights: {
          include: { flight: true },
          orderBy: { order: 'asc' }
        }
      }
    });
    if (!it) return null;
    const flightsData: ItineraryFlight[] = it.flights.map((f: any) => ({
      id: f.flight.id,
      flight_number: f.flight.flight_number,
      origin_iata: f.flight.origin_iata,
      destination_iata: f.flight.destination_iata,
      departure_datetime: f.flight.departure_datetime,
      arrival_datetime: f.flight.arrival_datetime,
    }));
    if (flightsData.length === 0) {
      return new Itinerary(it.id, '', '', new Date(), new Date(), 0, 0, []);
    }
    const origin_iata = flightsData[0].origin_iata;
    const destination_iata = flightsData[flightsData.length - 1].destination_iata;
    const departure_datetime = flightsData[0].departure_datetime;
    const arrival_datetime = flightsData[flightsData.length - 1].arrival_datetime;
    const total_duration_minutes = Math.round(
      (arrival_datetime.getTime() - departure_datetime.getTime()) / 60000
    );
    const stops = flightsData.length - 1;
    return new Itinerary(
      it.id,
      origin_iata,
      destination_iata,
      departure_datetime,
      arrival_datetime,
      total_duration_minutes,
      stops,
      flightsData
    );
  }

  async delete(id: string): Promise<void> {
    // Remove as relações ItineraryFlight primeiro
    await this.prisma.itineraryFlight.deleteMany({ where: { itineraryId: id } });
    // Remove o itinerário
    await this.prisma.itinerary.delete({ where: { id } });
  }
} 