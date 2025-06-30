import { Booking, BookingStatus } from '../../entities/Booking';
import { IBookingsRepository } from '../../interfaces/repositories/IBookingsRepository';

export interface CancelBookingRequest {
  id: string;
}

export class CancelBooking {
  constructor(private bookingsRepository: IBookingsRepository) {}

  async execute(request: CancelBookingRequest): Promise<Booking> {
    const { id } = request;

    // Buscar a reserva
    const booking = await this.bookingsRepository.findById(id);
    if (!booking) {
      throw { status: 404, message: 'Reserva não encontrada.' };
    }

    // Verificar se já não está cancelada
    if (booking.status === BookingStatus.CANCELLED) {
      throw { status: 400, message: 'Reserva já está cancelada.' };
    }

    // Atualizar o status para CANCELLED
    const updatedBooking = await this.bookingsRepository.update(id, {
      status: BookingStatus.CANCELLED
    });

    if (!updatedBooking) {
      throw { status: 500, message: 'Erro ao cancelar a reserva.' };
    }

    return updatedBooking;
  }
} 