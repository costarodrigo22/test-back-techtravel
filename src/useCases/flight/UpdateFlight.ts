import { Flight } from '../../entities/Flight';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const UpdateFlightSchema = z.object({
  id: z.string().min(1, 'ID do voo é obrigatório'),
  data: z.object({
    flight_number: z.string().min(1, 'Número do voo é obrigatório').optional(),
    airline_id: z.string().min(1, 'ID da companhia aérea é obrigatório').optional(),
    origin_iata: z.string().min(1, 'Código IATA de origem é obrigatório').optional(),
    destination_iata: z.string().min(1, 'Código IATA de destino é obrigatório').optional(),
    departure_datetime: z.date({
      invalid_type_error: 'Data e hora de partida deve ser uma data válida',
    }).optional(),
    arrival_datetime: z.date({
      invalid_type_error: 'Data e hora de chegada deve ser uma data válida',
    }).optional(),
    frequency: z.array(z.number().int().min(0).max(6)).min(1, 'Frequência deve ter pelo menos um dia da semana').optional(),
  }),
});

export type UpdateFlightRequest = z.infer<typeof UpdateFlightSchema>;

export class UpdateFlight {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(request: UpdateFlightRequest): Promise<Flight> {
    const parsed = UpdateFlightSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { id, data } = request;

    const existingFlight = await this.flightsRepository.findById(id);
    if (!existingFlight) {
      throw new NotFoundError('Voo não encontrado.');
    }

    const updatedFlight = await this.flightsRepository.update(id, data);
    if (!updatedFlight) {
      throw new AppError('Erro ao atualizar o voo.', 500);
    }

    return updatedFlight;
  }
} 