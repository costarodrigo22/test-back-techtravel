import { Booking } from '../../entities/Booking';
import { IBookingsRepository } from '../../interfaces/repositories/IBookingsRepository';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';

export interface GetUserBookingsRequest {
  userId: string;
}

export class GetUserBookings {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private usersRepository: IUsersRepository
  ) {}

  async execute(request: GetUserBookingsRequest): Promise<Booking[]> {
    const { userId } = request;

    // Validar se o usuário existe
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw { status: 404, message: 'Usuário não encontrado.' };
    }

    // Buscar todas as reservas do usuário
    return this.bookingsRepository.findByUserId(userId);
  }
} 