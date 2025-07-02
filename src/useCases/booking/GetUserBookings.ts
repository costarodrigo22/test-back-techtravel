import { Booking } from '../../entities/Booking';
import { IBookingsRepository } from '../../interfaces/repositories/IBookingsRepository';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const GetUserBookingsSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
});

export type GetUserBookingsRequest = z.infer<typeof GetUserBookingsSchema>;

export class GetUserBookings {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private usersRepository: IUsersRepository
  ) {}

  async execute(request: GetUserBookingsRequest): Promise<Booking[]> {
    const parsed = GetUserBookingsSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { userId } = request;

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    return this.bookingsRepository.findByUserId(userId);
  }
} 