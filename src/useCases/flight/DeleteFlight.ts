import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const DeleteFlightSchema = z.object({
  id: z.string().min(1, 'ID do voo é obrigatório'),
});

export type DeleteFlightRequest = z.infer<typeof DeleteFlightSchema>;

export class DeleteFlight {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(request: DeleteFlightRequest): Promise<void> {
    const parsed = DeleteFlightSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id } = request;

    const existingFlight = await this.flightsRepository.findById(id);
    if (!existingFlight) {
      throw new NotFoundError('Voo não encontrado.');
    }

    await this.flightsRepository.delete(id);
  }
} 