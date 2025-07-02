import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { Itinerary } from '../../entities/Itinerary';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const SearchAvailabilitySchema = z.object({
  origin: z.string().min(1, 'Origem é obrigatória'),
  destination: z.string().min(1, 'Destino é obrigatório'),
  departure_date: z.string().min(1, 'Data de partida é obrigatória'),
  return_date: z.string().optional(),
  airlines: z.array(z.string()).optional(),
  max_stops: z.number().int().nonnegative().optional(),
});

export type SearchAvailabilityRequest = z.infer<typeof SearchAvailabilitySchema>;

export interface SearchAvailabilityResponse {
  outbound_itineraries: Itinerary[];
  inbound_itineraries: Itinerary[];
}

export class SearchAvailability {
  private readonly MAX_ITINERARIES = 10;

  constructor(
    private itinerariesRepository: IItinerariesRepository
  ) {}

  async execute(request: SearchAvailabilityRequest): Promise<SearchAvailabilityResponse> {
    const parsed = SearchAvailabilitySchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { origin, destination, departure_date, return_date, airlines, max_stops } = request;

    const allItineraries = await this.itinerariesRepository.findAll();
    
    const outbound = this.filterItineraries(allItineraries, origin, destination, departure_date, airlines, max_stops);
    
    let inbound: Itinerary[] = [];
    if (return_date) {
      inbound = this.filterItineraries(allItineraries, destination, origin, return_date, airlines, max_stops);
    }

    return {
      outbound_itineraries: outbound.slice(0, this.MAX_ITINERARIES),
      inbound_itineraries: inbound.slice(0, this.MAX_ITINERARIES),
    };
  }

  private filterItineraries(
    itineraries: Itinerary[],
    origin: string,
    destination: string,
    date: string,
    airlines?: string[],
    max_stops?: number
  ): Itinerary[] {
    return itineraries.filter(itinerary => {
      if (itinerary.origin_iata !== origin || itinerary.destination_iata !== destination) {
        return false;
      }

      const depDate = itinerary.departure_datetime.toISOString().slice(0, 10);
      if (depDate !== date) {
        return false;
      }

      if (max_stops !== undefined && itinerary.stops > max_stops) {
        return false;
      }

      if (airlines && airlines.length > 0) {
        const itineraryAirlines = itinerary.flights.map(f => f.airline_iata_code).filter((airline): airline is string => Boolean(airline));
        const hasMatchingAirline = itineraryAirlines.some(airline => airlines.includes(airline));
        if (!hasMatchingAirline) {
          return false;
        }
      }

      return true;
    });
  }
} 