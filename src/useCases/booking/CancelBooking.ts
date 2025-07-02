import { Booking, BookingStatus } from '../../entities/Booking';
import { IBookingsRepository } from '../../interfaces/repositories/IBookingsRepository';
import { NotFoundError } from '../../errors/NotFoundError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const CancelBookingSchema = z.object({
  bookingId: z.string().min(1, 'ID da reserva é obrigatório'),
});

export type CancelBookingRequest = z.infer<typeof CancelBookingSchema>;

export class CancelBooking {
  constructor(private bookingsRepository: IBookingsRepository) {}

  async execute(request: CancelBookingRequest): Promise<Booking> {
    const parsed = CancelBookingSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    const { bookingId } = request;

    const booking = await this.bookingsRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Reserva não encontrada.');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new AppError('Reserva já está cancelada.', 409);
    }

    booking.status = BookingStatus.CANCELLED;
    const updated = await this.bookingsRepository.update(bookingId, { status: BookingStatus.CANCELLED });
    if (!updated) {
      throw new AppError('Falha ao cancelar a reserva.', 500);
    }
    return updated;
  }
} 