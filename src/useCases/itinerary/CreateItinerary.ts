import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { Itinerary } from '../../entities/Itinerary';

export interface CreateItineraryRequest {
  flight_ids: string[];
}

export class CreateItinerary {
  private readonly MIN_CONNECTION_MINUTES = 45;

  constructor(
    private itinerariesRepository: IItinerariesRepository,
    private flightsRepository: IFlightsRepository
  ) {}

  async execute(request: CreateItineraryRequest): Promise<Itinerary> {
    const { flight_ids } = request;
    if (!flight_ids || !Array.isArray(flight_ids) || flight_ids.length < 2) {
      throw { status: 400, message: 'É necessário informar pelo menos dois voos para criar um itinerário.' };
    }
    // Buscar voos na ordem dos IDs recebidos
    const flights = await this.flightsRepository.findAll({});
    const selectedFlights = flight_ids.map(id => {
      const f = flights.find(f => f.id === id);
      if (!f) throw { status: 400, message: `Voo com id ${id} não encontrado.` };
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
        throw { status: 400, message: `O destino do voo ${curr.flight_number} (${curr.destination_iata}) deve ser igual à origem do próximo voo ${next.flight_number} (${next.origin_iata}).` };
      }
      // Validação temporal
      if (next.departure_datetime <= curr.arrival_datetime) {
        throw { status: 400, message: `O horário de partida do voo ${next.flight_number} deve ser após a chegada do voo ${curr.flight_number}.` };
      }
      // Validação de conexão mínima
      const diffMinutes = (next.departure_datetime.getTime() - curr.arrival_datetime.getTime()) / 60000;
      if (diffMinutes < this.MIN_CONNECTION_MINUTES) {
        throw { status: 400, message: `Tempo de conexão entre o voo ${curr.flight_number} e ${next.flight_number} deve ser de pelo menos ${this.MIN_CONNECTION_MINUTES} minutos.` };
      }
    }
    // Criar itinerário
    return this.itinerariesRepository.create(flight_ids);
  }
} 