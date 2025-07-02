import { Airline } from '../../entities/Airline';
import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export const CreateAirlineSchema = z.object({
  name: z.string().min(1, 'Nome da companhia aérea é obrigatório'),
  iata_code: z.string().min(2, 'Código IATA deve ter pelo menos 2 caracteres').max(3, 'Código IATA deve ter no máximo 3 caracteres'),
});

export type CreateAirlineRequest = z.infer<typeof CreateAirlineSchema>;

export class CreateAirline {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(request: CreateAirlineRequest): Promise<Airline> {
    const parsed = CreateAirlineSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const airline = new Airline(randomUUID(), request.name, request.iata_code);
    return this.airlinesRepository.create(airline);
  }
} 