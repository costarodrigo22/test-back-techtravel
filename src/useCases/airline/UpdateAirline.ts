import { Airline } from '../../entities/Airline';
import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const UpdateAirlineSchema = z.object({
  id: z.string().min(1, 'ID da companhia aérea é obrigatório'),
  data: z.object({
    name: z.string().min(1, 'Nome da companhia aérea é obrigatório').optional(),
    iata_code: z.string().min(2, 'Código IATA deve ter pelo menos 2 caracteres').max(3, 'Código IATA deve ter no máximo 3 caracteres').optional(),
  }),
});

export type UpdateAirlineRequest = z.infer<typeof UpdateAirlineSchema>;

export class UpdateAirline {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(request: UpdateAirlineRequest): Promise<Airline> {
    // Validação centralizada com zod
    const parsed = UpdateAirlineSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id, data } = request;

    // Verificar se a companhia aérea existe
    const existingAirline = await this.airlinesRepository.findById(id);
    if (!existingAirline) {
      throw new NotFoundError('Companhia aérea não encontrada.');
    }

    const updatedAirline = await this.airlinesRepository.update(id, data);
    if (!updatedAirline) {
      throw new AppError('Erro ao atualizar a companhia aérea.', 500);
    }

    return updatedAirline;
  }
} 