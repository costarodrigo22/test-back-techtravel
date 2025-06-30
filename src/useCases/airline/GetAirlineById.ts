import { Airline } from '../../entities/Airline';
import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';

export class GetAirlineById {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(id: string): Promise<Airline | null> {
    return this.airlinesRepository.findById(id);
  }
} 