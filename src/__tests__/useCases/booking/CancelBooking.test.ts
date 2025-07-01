import { CancelBooking, CancelBookingRequest } from '../../../useCases/booking/CancelBooking';
import { IBookingsRepository } from '../../../interfaces/repositories/IBookingsRepository';
import { Booking, BookingStatus } from '../../../entities/Booking';

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

    const request: CancelBookingRequest = { id: booking.id };
    const updatedBooking = await cancelBookingUseCase.execute(request);

    expect(updatedBooking.status).toBe(BookingStatus.CANCELLED);
    expect(updatedBooking.updatedAt).toBeInstanceOf(Date);
  });

  it('deve lançar erro se reserva não for encontrada', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const cancelBookingUseCase = new CancelBooking(fakeBookingsRepo);

    const request: CancelBookingRequest = { id: 'id-inexistente' };
    await expect(cancelBookingUseCase.execute(request))
      .rejects
      .toMatchObject({ status: 404, message: 'Reserva não encontrada.' });
  });

  it('deve lançar erro se reserva já estiver cancelada', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const cancelBookingUseCase = new CancelBooking(fakeBookingsRepo);

    const booking = new Booking('user1', 'iti1', BookingStatus.CANCELLED);
    await fakeBookingsRepo.create(booking);

    const request: CancelBookingRequest = { id: booking.id };
    await expect(cancelBookingUseCase.execute(request))
      .rejects
      .toMatchObject({ status: 400, message: 'Reserva já está cancelada.' });
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

    const request: CancelBookingRequest = { id: booking.id };
    await expect(cancelBookingUseCase.execute(request))
      .rejects
      .toMatchObject({ status: 500, message: 'Erro ao cancelar a reserva.' });
  });
}); 