import { Booking } from '../../entities/Booking';
import { IBookingsRepository } from '../../interfaces/repositories/IBookingsRepository';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IItinerariesRepository } from '../../interfaces/repositories/IItinerariesRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const CreateBookingSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
  itineraryId: z.string().min(1, 'ID do itinerário é obrigatório'),
});

export type CreateBookingRequest = z.infer<typeof CreateBookingSchema>;

export class CreateBooking {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private usersRepository: IUsersRepository,
    private itinerariesRepository: IItinerariesRepository
  ) {}

  async execute(request: CreateBookingRequest): Promise<Booking> {
    // Validação centralizada com zod
    const parsed = CreateBookingSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { userId, itineraryId } = request;

    // Validar se o usuário existe
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    // Validar se o itinerário existe
    const itinerary = await this.itinerariesRepository.findById(itineraryId);
    if (!itinerary) {
      throw new NotFoundError('Itinerário não encontrado.');
    }

    // Criar a reserva
    const booking = new Booking(userId, itineraryId);
    return this.bookingsRepository.create(booking);
  }
} 