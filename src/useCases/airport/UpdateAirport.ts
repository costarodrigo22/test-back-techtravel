import { Airport } from '../../entities/Airport';
import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const UpdateAirportSchema = z.object({
  id: z.string().min(1, 'ID do aeroporto é obrigatório'),
  data: z.object({
    name: z.string().min(1, 'Nome do aeroporto é obrigatório').optional(),
    iata_code: z.string().min(3, 'Código IATA deve ter 3 caracteres').max(3, 'Código IATA deve ter 3 caracteres').optional(),
  }),
});

export type UpdateAirportRequest = z.infer<typeof UpdateAirportSchema>;

export class UpdateAirport {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(request: UpdateAirportRequest): Promise<Airport> {
    const parsed = UpdateAirportSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id, data } = request;

    const existingAirport = await this.airportsRepository.findById(id);
    if (!existingAirport) {
      throw new NotFoundError('Aeroporto não encontrado.');
    }

    const updatedAirport = await this.airportsRepository.update(id, data);
    if (!updatedAirport) {
      throw new AppError('Erro ao atualizar o aeroporto.', 500);
    }

    return updatedAirport;
  }
} 