import { Airport } from '../../entities/Airport';
import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const ListAirportsSchema = z.object({});

export type ListAirportsRequest = z.infer<typeof ListAirportsSchema>;

export class ListAirports {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(request: ListAirportsRequest = {}): Promise<Airport[]> {
    // Validação centralizada com zod
    const parsed = ListAirportsSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    return this.airportsRepository.findAll();
  }
} 