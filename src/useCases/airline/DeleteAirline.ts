import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';

export class DeleteAirline {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(id: string): Promise<void> {
    await this.airlinesRepository.delete(id);
  }
} 