import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { Itinerary } from '../../entities/Itinerary';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const GetItineraryByIdSchema = z.object({
  id: z.string().min(1, 'ID do itinerário é obrigatório'),
});

export type GetItineraryByIdRequest = z.infer<typeof GetItineraryByIdSchema>;

export class GetItineraryById {
  constructor(private itinerariesRepository: IItinerariesRepository) {}

  async execute(request: GetItineraryByIdRequest): Promise<Itinerary> {
    const parsed = GetItineraryByIdSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id } = request;

    const itinerary = await this.itinerariesRepository.findById(id);
    if (!itinerary) {
      throw new NotFoundError('Itinerário não encontrado.');
    }

    return itinerary;
  }
} 