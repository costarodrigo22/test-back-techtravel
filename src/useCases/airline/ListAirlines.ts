import { Airline } from '../../entities/Airline';
import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const ListAirlinesSchema = z.object({});

export type ListAirlinesRequest = z.infer<typeof ListAirlinesSchema>;

export class ListAirlines {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(request: ListAirlinesRequest = {}): Promise<Airline[]> {
    const parsed = ListAirlinesSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    return this.airlinesRepository.findAll();
  }
} 