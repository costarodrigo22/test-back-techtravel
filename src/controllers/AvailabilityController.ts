import { Request, Response } from 'express';
import { SearchAvailability } from '../useCases/availability/SearchAvailability';

/**
 * @openapi
 * /availability/search:
 *   post:
 *     summary: Busca disponibilidade de itinerários
 *     tags:
 *       - Availability
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin_iata:
 *                 type: string
 *               destination_iata:
 *                 type: string
 *               departure_date:
 *                 type: string
 *                 format: date
 *               return_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Itinerários disponíveis retornados com sucesso
 */
export class AvailabilityController {
  constructor(private searchAvailability: SearchAvailability) {}

  async search(req: Request, res: Response) {
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
  }
} 