import { CreateBooking, CreateBookingRequest } from '../../../useCases/booking/CreateBooking';
import { IBookingsRepository } from '../../../interfaces/repositories/IBookingsRepository';
import { IUsersRepository } from '../../../interfaces/repositories/IUsersRepository';
import { IItinerariesRepository } from '../../../interfaces/repositories/IItinerariesRepository';
import { Booking, BookingStatus } from '../../../entities/Booking';
import { User, UserGender } from '../../../entities/User';
import { Itinerary } from '../../../entities/Itinerary';
import { NotFoundError } from '../../../errors/NotFoundError';

describe('CreateBooking UseCase', () => {
  class FakeBookingsRepository implements IBookingsRepository {
    private bookings: Booking[] = [];

    async create(booking: Booking): Promise<Booking> {
      this.bookings.push(booking);
      return booking;
    }
    async findById(id: string): Promise<Booking | null> { return this.bookings.find(b => b.id === id) || null; }
    async findByUserId(userId: string): Promise<Booking[]> { return this.bookings.filter(b => b.user_id === userId); }
    async findByItineraryId(itineraryId: string): Promise<Booking[]> { return this.bookings.filter(b => b.itinerary_id === itineraryId); }
    async update(id: string, booking: Partial<Booking>): Promise<Booking | null> { return null; }
    async delete(id: string): Promise<void> { }
    async findAll(): Promise<Booking[]> { return this.bookings; }
  }

  class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];
    async create(user: User): Promise<void> { this.users.push(user); }
    async findById(id: string): Promise<User | null> { return this.users.find(u => u.id === id) || null; }
    async findByEmail(email: string): Promise<User | null> { return this.users.find(u => u.email === email) || null; }
  }

  class FakeItinerariesRepository implements IItinerariesRepository {
    private itineraries: Itinerary[] = [];
    async findAll(): Promise<Itinerary[]> { return this.itineraries; }
    async findById(id: string): Promise<Itinerary | null> { return this.itineraries.find(i => i.id === id) || null; }
    async create(flightIds: string[]): Promise<Itinerary> { throw new Error('not implemented'); }
    async delete(id: string): Promise<void> { }
  }

  it('deve criar uma reserva se usuário e itinerário existirem', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const fakeUsersRepo = new FakeUsersRepository();
    const fakeItinerariesRepo = new FakeItinerariesRepository();
    const createBookingUseCase = new CreateBooking(fakeBookingsRepo, fakeUsersRepo, fakeItinerariesRepo);

    const user = new User('João', 'joao@email.com', 'senha123', UserGender.MALE);
    await fakeUsersRepo.create(user);
    const itinerary = new Itinerary('iti1', 'GRU', 'JFK', new Date(), new Date(), 600, 0, []);
    fakeItinerariesRepo['itineraries'].push(itinerary);

    const request: CreateBookingRequest = {
      user_id: user.id,
      itinerary_id: itinerary.id,
    };

    const booking = await createBookingUseCase.execute(request);
    expect(booking).toBeInstanceOf(Booking);
    expect(booking.user_id).toBe(user.id);
    expect(booking.itinerary_id).toBe(itinerary.id);
    expect(booking.status).toBe(BookingStatus.CONFIRMED);
  });

  it('deve lançar erro se usuário não existir', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const fakeUsersRepo = new FakeUsersRepository();
    const fakeItinerariesRepo = new FakeItinerariesRepository();
    const createBookingUseCase = new CreateBooking(fakeBookingsRepo, fakeUsersRepo, fakeItinerariesRepo);

    const itinerary = new Itinerary('iti1', 'GRU', 'JFK', new Date(), new Date(), 600, 0, []);
    fakeItinerariesRepo['itineraries'].push(itinerary);

    const request: CreateBookingRequest = {
      user_id: 'id-inexistente',
      itinerary_id: itinerary.id,
    };

    await expect(createBookingUseCase.execute(request))
      .rejects
      .toThrow(NotFoundError);
  });

  it('deve lançar erro se itinerário não existir', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const fakeUsersRepo = new FakeUsersRepository();
    const fakeItinerariesRepo = new FakeItinerariesRepository();
    const createBookingUseCase = new CreateBooking(fakeBookingsRepo, fakeUsersRepo, fakeItinerariesRepo);

    const user = new User('João', 'joao@email.com', 'senha123', UserGender.MALE);
    await fakeUsersRepo.create(user);

    const request: CreateBookingRequest = {
      user_id: user.id,
      itinerary_id: 'id-inexistente',
    };

    await expect(createBookingUseCase.execute(request))
      .rejects
      .toThrow(NotFoundError);
  });
}); 