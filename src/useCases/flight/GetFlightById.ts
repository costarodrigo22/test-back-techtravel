import { Flight } from '../../entities/Flight';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const GetFlightByIdSchema = z.object({
  id: z.string().min(1, 'ID do voo é obrigatório'),
});

export type GetFlightByIdRequest = z.infer<typeof GetFlightByIdSchema>;

export class GetFlightById {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(request: GetFlightByIdRequest): Promise<Flight> {
    // Validação centralizada com zod
    const parsed = GetFlightByIdSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id } = request;

    const flight = await this.flightsRepository.findById(id);
    if (!flight) {
      throw new NotFoundError('Voo não encontrado.');
    }

    return flight;
  }
} 