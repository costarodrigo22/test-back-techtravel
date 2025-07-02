import { Itinerary } from '../../entities/Itinerary';
import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const ListItinerariesSchema = z.object({});

export type ListItinerariesRequest = z.infer<typeof ListItinerariesSchema>;

export class ListItineraries {
  constructor(private itinerariesRepository: IItinerariesRepository) {}

  async execute(request: ListItinerariesRequest = {}): Promise<Itinerary[]> {
    const parsed = ListItinerariesSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    return this.itinerariesRepository.findAll();
  }
} 