import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { Itinerary } from '../../entities/Itinerary';

export class GetItineraryById {
  constructor(private itinerariesRepository: IItinerariesRepository) {}

  async execute(id: string): Promise<Itinerary | null> {
    return this.itinerariesRepository.findById(id);
  }
} 