import { Airline } from '../../entities/Airline';
import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';

export class ListAirlines {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(): Promise<Airline[]> {
    return this.airlinesRepository.findAll();
  }
} 