import { Flight } from '../../entities/Flight';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';

export interface ListFlightsFilters {
  airline_code?: string;
  origin?: string;
  destination?: string;
}

export class ListFlights {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(filters?: ListFlightsFilters): Promise<Flight[]> {
    return this.flightsRepository.findAll(filters);
  }
} 