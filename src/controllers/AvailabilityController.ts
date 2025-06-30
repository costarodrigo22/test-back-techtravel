import { Request, Response } from 'express';
import { SearchAvailability } from '../useCases/availability/SearchAvailability';

export class AvailabilityController {
  constructor(private searchAvailability: SearchAvailability) {}

  async search(req: Request, res: Response) {
    try {
      const result = await this.searchAvailability.execute(req.body);
      // Mapeia os itinerários para garantir o campo itinerary_id
      const mapItinerary = (it: any) => ({
        itinerary_id: it.id,
        origin_iata: it.origin_iata,
        destination_iata: it.destination_iata,
        departure_datetime: it.departure_datetime,
        arrival_datetime: it.arrival_datetime,
        total_duration_minutes: it.total_duration_minutes,
        stops: it.stops,
        flights: it.flights
      });
      return res.json({
        outbound_itineraries: result.outbound_itineraries.map(mapItinerary),
        inbound_itineraries: result.inbound_itineraries.map(mapItinerary)
      });
    } catch (error: any) {
      if (error.status && error.message) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao buscar disponibilidade.' });
    }
  }
} 