import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const DeleteAirlineSchema = z.object({
  id: z.string().min(1, 'ID da companhia aérea é obrigatório'),
});

export type DeleteAirlineRequest = z.infer<typeof DeleteAirlineSchema>;

export class DeleteAirline {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(request: DeleteAirlineRequest): Promise<void> {
    const parsed = DeleteAirlineSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id } = request;

    const existingAirline = await this.airlinesRepository.findById(id);
    if (!existingAirline) {
      throw new NotFoundError('Companhia aérea não encontrada.');
    }

    await this.airlinesRepository.delete(id);
  }
} 