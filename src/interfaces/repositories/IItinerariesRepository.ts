import { Itinerary } from '../../entities/Itinerary';

export interface IItinerariesRepository {
  findAll(): Promise<Itinerary[]>;
  findById(id: string): Promise<Itinerary | null>;
  create(flightIds: string[]): Promise<Itinerary>;
  delete(id: string): Promise<void>;
} 