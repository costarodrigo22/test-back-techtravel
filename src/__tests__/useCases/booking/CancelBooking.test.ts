import { CancelBooking, CancelBookingRequest } from '../../../useCases/booking/CancelBooking';
import { IBookingsRepository } from '../../../interfaces/repositories/IBookingsRepository';
import { Booking, BookingStatus } from '../../../entities/Booking';
import { AppError } from '../../../errors/AppError';
import { NotFoundError } from '../../../errors/NotFoundError';

class FakeBookingsRepository implements IBookingsRepository {
  private bookings: Booking[] = [];

  async create(booking: Booking): Promise<Booking> {
    this.bookings.push(booking);
    return booking;
  }
  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find(b => b.id === id) || null;
  }
  async findByUserId(userId: string): Promise<Booking[]> { return this.bookings.filter(b => b.user_id === userId); }
  async findByItineraryId(itineraryId: string): Promise<Booking[]> { return this.bookings.filter(b => b.itinerary_id === itineraryId); }
  async update(id: string, booking: Partial<Booking>): Promise<Booking | null> {
    const idx = this.bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.bookings[idx] = { ...this.bookings[idx], ...booking, updatedAt: new Date() };
    return this.bookings[idx];
  }
  async delete(id: string): Promise<void> { }
  async findAll(): Promise<Booking[]> { return this.bookings; }
}

describe('CancelBooking UseCase', () => {
  it('deve cancelar uma reserva existente e confirmada', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const cancelBookingUseCase = new CancelBooking(fakeBookingsRepo);

    const booking = new Booking('user1', 'iti1', BookingStatus.CONFIRMED);
    await fakeBookingsRepo.create(booking);

    const request: CancelBookingRequest = { bookingId: booking.id };
    const updatedBooking = await cancelBookingUseCase.execute(request);

    expect(updatedBooking.status).toBe(BookingStatus.CANCELLED);
    expect(updatedBooking.updatedAt).toBeInstanceOf(Date);
  });

  it('deve lançar erro se reserva não for encontrada', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const cancelBookingUseCase = new CancelBooking(fakeBookingsRepo);

    const request: CancelBookingRequest = { bookingId: 'id-inexistente' };
    await expect(cancelBookingUseCase.execute(request))
      .rejects
      .toThrow(NotFoundError);
  });

  it('deve lançar erro se reserva já estiver cancelada', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const cancelBookingUseCase = new CancelBooking(fakeBookingsRepo);

    const booking = new Booking('user1', 'iti1', BookingStatus.CANCELLED);
    await fakeBookingsRepo.create(booking);

    const request: CancelBookingRequest = { bookingId: booking.id };
    await expect(cancelBookingUseCase.execute(request))
      .rejects
      .toThrow(AppError);
  });

  it('deve lançar erro se falhar ao atualizar a reserva', async () => {
    class FailingBookingsRepository extends FakeBookingsRepository {
      async update(id: string, booking: Partial<Booking>): Promise<Booking | null> {
        return null;
      }
    }
    const fakeBookingsRepo = new FailingBookingsRepository();
    const cancelBookingUseCase = new CancelBooking(fakeBookingsRepo);

    const booking = new Booking('user1', 'iti1', BookingStatus.CONFIRMED);
    await fakeBookingsRepo.create(booking);

    const request: CancelBookingRequest = { bookingId: booking.id };
    await expect(cancelBookingUseCase.execute(request))
      .rejects
      .toThrow(AppError);
  });
}); 