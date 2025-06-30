import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';

export class DeleteItinerary {
  constructor(private itinerariesRepository: IItinerariesRepository) {}

  async execute(id: string): Promise<void> {
    await this.itinerariesRepository.delete(id);
  }
} 