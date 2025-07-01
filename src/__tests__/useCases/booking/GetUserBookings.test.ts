import { GetUserBookings, GetUserBookingsRequest } from '../../../useCases/booking/GetUserBookings';
import { IBookingsRepository } from '../../../interfaces/repositories/IBookingsRepository';
import { IUsersRepository } from '../../../interfaces/repositories/IUsersRepository';
import { Booking, BookingStatus } from '../../../entities/Booking';
import { User, UserGender } from '../../../entities/User';

describe('GetUserBookings UseCase', () => {
  class FakeBookingsRepository implements IBookingsRepository {
    private bookings: Booking[] = [];
    async create(booking: Booking): Promise<Booking> { this.bookings.push(booking); return booking; }
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

  it('deve retornar todas as reservas do usuário existente', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const fakeUsersRepo = new FakeUsersRepository();
    const getUserBookingsUseCase = new GetUserBookings(fakeBookingsRepo, fakeUsersRepo);

    const user = new User('João', 'joao@email.com', 'senha123', UserGender.MALE);
    await fakeUsersRepo.create(user);
    const booking1 = new Booking(user.id, 'iti1', BookingStatus.CONFIRMED);
    const booking2 = new Booking(user.id, 'iti2', BookingStatus.CANCELLED);
    await fakeBookingsRepo.create(booking1);
    await fakeBookingsRepo.create(booking2);

    const request: GetUserBookingsRequest = { userId: user.id };
    const bookings = await getUserBookingsUseCase.execute(request);

    expect(bookings).toHaveLength(2);
    expect(bookings[0].user_id).toBe(user.id);
    expect(bookings[1].user_id).toBe(user.id);
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    const fakeBookingsRepo = new FakeBookingsRepository();
    const fakeUsersRepo = new FakeUsersRepository();
    const getUserBookingsUseCase = new GetUserBookings(fakeBookingsRepo, fakeUsersRepo);

    const request: GetUserBookingsRequest = { userId: 'id-inexistente' };
    await expect(getUserBookingsUseCase.execute(request))
      .rejects
      .toMatchObject({ status: 404, message: 'Usuário não encontrado.' });
  });
}); 