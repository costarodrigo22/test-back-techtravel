import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { Itinerary } from '../../entities/Itinerary';

export interface SearchAvailabilityRequest {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  airlines?: string[];
  max_stops?: number;
}

export interface SearchAvailabilityResponse {
  outbound_itineraries: Itinerary[];
  inbound_itineraries: Itinerary[];
}

export class SearchAvailability {
  private readonly MAX_ITINERARIES = 10;

  constructor(
    private flightsRepository: IFlightsRepository,
    private itinerariesRepository: IItinerariesRepository
  ) {}

  async execute(request: SearchAvailabilityRequest): Promise<SearchAvailabilityResponse> {
    const { origin, destination, departure_date, return_date, airlines, max_stops } = request;
    if (!origin || !destination || !departure_date) {
      throw { status: 400, message: 'origin, destination e departure_date são obrigatórios.' };
    }

    // Buscar todos os itinerários existentes
    const allItineraries = await this.itinerariesRepository.findAll();
    
    // Filtrar itinerários de ida
    const outbound = this.filterItineraries(allItineraries, origin, destination, departure_date, airlines, max_stops);
    
    // Filtrar itinerários de volta (se houver return_date)
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
      // Filtrar por origem e destino
      if (itinerary.origin_iata !== origin || itinerary.destination_iata !== destination) {
        return false;
      }

      // Filtrar por data
      const depDate = itinerary.departure_datetime.toISOString().slice(0, 10);
      if (depDate !== date) {
        return false;
      }

      // Filtrar por número máximo de paradas
      if (max_stops !== undefined && itinerary.stops > max_stops) {
        return false;
      }

      // Filtrar por companhias aéreas
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