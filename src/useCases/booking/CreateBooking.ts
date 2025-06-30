import { Booking } from '../../entities/Booking';
import { IBookingsRepository } from '../../interfaces/repositories/IBookingsRepository';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';

export interface CreateBookingRequest {
  user_id: string;
  itinerary_id: string;
}

export class CreateBooking {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private usersRepository: IUsersRepository,
    private itinerariesRepository: IItinerariesRepository
  ) {}

  async execute(request: CreateBookingRequest): Promise<Booking> {
    const { user_id, itinerary_id } = request;

    // Validar se o usuário existe
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw { status: 404, message: 'Usuário não encontrado.' };
    }

    // Validar se o itinerário existe
    const itinerary = await this.itinerariesRepository.findById(itinerary_id);
    if (!itinerary) {
      throw { status: 404, message: 'Itinerário não encontrado.' };
    }

    // Criar a reserva
    const booking = new Booking(user_id, itinerary_id);
    return this.bookingsRepository.create(booking);
  }
} 