import { Airport } from '../../entities/Airport';
import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const GetAirportByIdSchema = z.object({
  id: z.string().min(1, 'ID do aeroporto é obrigatório'),
});

export type GetAirportByIdRequest = z.infer<typeof GetAirportByIdSchema>;

export class GetAirportById {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(request: GetAirportByIdRequest): Promise<Airport> {
    // Validação centralizada com zod
    const parsed = GetAirportByIdSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id } = request;

    const airport = await this.airportsRepository.findById(id);
    if (!airport) {
      throw new NotFoundError('Aeroporto não encontrado.');
    }

    return airport;
  }
} 