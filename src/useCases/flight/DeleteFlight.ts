import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';

export class DeleteFlight {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(id: string): Promise<void> {
    await this.flightsRepository.delete(id);
  }
} 