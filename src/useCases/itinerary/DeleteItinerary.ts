import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const DeleteItinerarySchema = z.object({
  id: z.string().min(1, 'ID do itinerário é obrigatório'),
});

export type DeleteItineraryRequest = z.infer<typeof DeleteItinerarySchema>;

export class DeleteItinerary {
  constructor(private itinerariesRepository: IItinerariesRepository) {}

  async execute(request: DeleteItineraryRequest): Promise<void> {
    const parsed = DeleteItinerarySchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id } = request;

    const existingItinerary = await this.itinerariesRepository.findById(id);
    if (!existingItinerary) {
      throw new NotFoundError('Itinerário não encontrado.');
    }

    await this.itinerariesRepository.delete(id);
  }
} 