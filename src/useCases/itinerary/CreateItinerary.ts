import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { Itinerary } from '../../entities/Itinerary';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const CreateItinerarySchema = z.object({
  flight_ids: z.array(z.string().min(1, 'ID do voo é obrigatório')).min(2, 'É necessário informar pelo menos dois voos para criar um itinerário'),
});

export type CreateItineraryRequest = z.infer<typeof CreateItinerarySchema>;

export class CreateItinerary {
  private readonly MIN_CONNECTION_MINUTES = 45;

  constructor(
    private itinerariesRepository: IItinerariesRepository,
    private flightsRepository: IFlightsRepository
  ) {}

  async execute(request: CreateItineraryRequest): Promise<Itinerary> {
    // Validação centralizada com zod
    const parsed = CreateItinerarySchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { flight_ids } = request;

    // Buscar voos na ordem dos IDs recebidos
    const flights = await this.flightsRepository.findAll({});
    const selectedFlights = flight_ids.map(id => {
      const f = flights.find(f => f.id === id);
      if (!f) throw new AppError(`Voo com id ${id} não encontrado.`, 400);
      return f;
    });

    // Ordenar por departure_datetime
    selectedFlights.sort((a, b) => a.departure_datetime.getTime() - b.departure_datetime.getTime());

    // Validações
    for (let i = 0; i < selectedFlights.length - 1; i++) {
      const curr = selectedFlights[i];
      const next = selectedFlights[i + 1];

      // Validação de rota
      if (curr.destination_iata !== next.origin_iata) {
        throw new AppError(`O destino do voo ${curr.flight_number} (${curr.destination_iata}) deve ser igual à origem do próximo voo ${next.flight_number} (${next.origin_iata}).`, 400);
      }

      // Validação temporal
      if (next.departure_datetime <= curr.arrival_datetime) {
        throw new AppError(`O horário de partida do voo ${next.flight_number} deve ser após a chegada do voo ${curr.flight_number}.`, 400);
      }

      // Validação de conexão mínima
      const diffMinutes = (next.departure_datetime.getTime() - curr.arrival_datetime.getTime()) / 60000;
      if (diffMinutes < this.MIN_CONNECTION_MINUTES) {
        throw new AppError(`Tempo de conexão entre o voo ${curr.flight_number} e ${next.flight_number} deve ser de pelo menos ${this.MIN_CONNECTION_MINUTES} minutos.`, 400);
      }
    }

    // Criar itinerário
    return this.itinerariesRepository.create(flight_ids);
  }
} 