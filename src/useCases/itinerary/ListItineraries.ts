import { Itinerary } from '../../entities/Itinerary';
import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';

export class ListItineraries {
  constructor(private itinerariesRepository: IItinerariesRepository) {}

  async execute(): Promise<Itinerary[]> {
    return this.itinerariesRepository.findAll();
  }
} 