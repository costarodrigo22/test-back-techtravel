import { Airport } from '../../entities/Airport';
import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export const CreateAirportSchema = z.object({
  name: z.string().min(1, 'Nome do aeroporto é obrigatório'),
  iata_code: z.string().min(3, 'Código IATA deve ter 3 caracteres').max(3, 'Código IATA deve ter 3 caracteres'),
});

export type CreateAirportRequest = z.infer<typeof CreateAirportSchema>;

export class CreateAirport {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(request: CreateAirportRequest): Promise<Airport> {
    const parsed = CreateAirportSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const airport = new Airport(randomUUID(), request.name, request.iata_code);
    return this.airportsRepository.create(airport);
  }
} 