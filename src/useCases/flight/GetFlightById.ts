import { Flight } from '../../entities/Flight';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';

export class GetFlightById {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(id: string): Promise<Flight | null> {
    return this.flightsRepository.findById(id);
  }
} 