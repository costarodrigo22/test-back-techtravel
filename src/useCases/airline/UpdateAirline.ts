import { Airline } from '../../entities/Airline';
import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';

export class UpdateAirline {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(id: string, data: Partial<Airline>): Promise<Airline | null> {
    return this.airlinesRepository.update(id, data);
  }
} 