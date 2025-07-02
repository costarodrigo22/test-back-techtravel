import { Flight } from '../../entities/Flight';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export const CreateFlightSchema = z.object({
  flight_number: z.string().min(1, 'Número do voo é obrigatório'),
  airline_id: z.string().min(1, 'ID da companhia aérea é obrigatório'),
  origin_iata: z.string().min(1, 'Código IATA de origem é obrigatório'),
  destination_iata: z.string().min(1, 'Código IATA de destino é obrigatório'),
  departure_datetime: z.date({
    required_error: 'Data e hora de partida é obrigatória',
    invalid_type_error: 'Data e hora de partida deve ser uma data válida',
  }),
  arrival_datetime: z.date({
    required_error: 'Data e hora de chegada é obrigatória',
    invalid_type_error: 'Data e hora de chegada deve ser uma data válida',
  }),
  frequency: z.array(z.number().int().min(0).max(6), {
    required_error: 'Frequência é obrigatória',
  }).min(1, 'Frequência deve ter pelo menos um dia da semana'),
});

export type CreateFlightRequest = z.infer<typeof CreateFlightSchema>;

export class CreateFlight {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(request: CreateFlightRequest): Promise<Flight> {
    const parsed = CreateFlightSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const flight = new Flight(
      randomUUID(),
      request.flight_number,
      request.airline_id,
      request.origin_iata,
      request.destination_iata,
      request.departure_datetime,
      request.arrival_datetime,
      request.frequency
    );
    return this.flightsRepository.create(flight);
  }
} 