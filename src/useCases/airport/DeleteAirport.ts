import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const DeleteAirportSchema = z.object({
  id: z.string().min(1, 'ID do aeroporto é obrigatório'),
});

export type DeleteAirportRequest = z.infer<typeof DeleteAirportSchema>;

export class DeleteAirport {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(request: DeleteAirportRequest): Promise<void> {
    // Validação centralizada com zod
    const parsed = DeleteAirportSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id } = request;

    // Verificar se o aeroporto existe
    const existingAirport = await this.airportsRepository.findById(id);
    if (!existingAirport) {
      throw new NotFoundError('Aeroporto não encontrado.');
    }

    await this.airportsRepository.delete(id);
  }
} 