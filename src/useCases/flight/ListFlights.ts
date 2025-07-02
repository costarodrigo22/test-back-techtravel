import { Flight } from '../../entities/Flight';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const ListFlightsSchema = z.object({
  filters: z.object({
    airline_code: z.string().optional(),
    origin: z.string().optional(),
    destination: z.string().optional(),
  }).optional(),
});

export type ListFlightsRequest = z.infer<typeof ListFlightsSchema>;

export interface ListFlightsFilters {
  airline_code?: string;
  origin?: string;
  destination?: string;
}

export class ListFlights {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(request: ListFlightsRequest = {}): Promise<Flight[]> {
    const parsed = ListFlightsSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { filters } = request;
    return this.flightsRepository.findAll(filters);
  }
} 