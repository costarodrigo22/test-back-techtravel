import { Flight } from '../../entities/Flight';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';

export class UpdateFlight {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(id: string, data: Partial<Flight>): Promise<Flight | null> {
    return this.flightsRepository.update(id, data);
  }
} 