import { Airline } from '../../entities/Airline';
import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const GetAirlineByIdSchema = z.object({
  id: z.string().min(1, 'ID da companhia aérea é obrigatório'),
});

export type GetAirlineByIdRequest = z.infer<typeof GetAirlineByIdSchema>;

export class GetAirlineById {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(request: GetAirlineByIdRequest): Promise<Airline> {
    const parsed = GetAirlineByIdSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id } = request;

    const airline = await this.airlinesRepository.findById(id);
    if (!airline) {
      throw new NotFoundError('Companhia aérea não encontrada.');
    }

    return airline;
  }
} 