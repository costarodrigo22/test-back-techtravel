import { GetUserProfile, GetUserProfileRequest } from '../../../useCases/user/GetUserProfile';
import { IUsersRepository } from '../../../interfaces/repositories/IUsersRepository';
import { User, UserGender } from '../../../entities/User';
import { NotFoundError } from '../../../errors/NotFoundError';
import { AppError } from '../../../errors/AppError';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }
}

describe('GetUserProfile UseCase', () => {
  it('deve retornar o perfil do usuário existente', async () => {
    const fakeRepo = new FakeUsersRepository();
    const getUserProfileUseCase = new GetUserProfile(fakeRepo);

    const user = new User('João', 'joao@email.com', 'senha123', UserGender.MALE);
    await fakeRepo.create(user);

    const request: GetUserProfileRequest = {
      userId: user.id,
    };

    const response = await getUserProfileUseCase.execute(request);

    expect(response.id).toBe(user.id);
    expect(response.name).toBe('João');
    expect(response.email).toBe('joao@email.com');
    expect(response.gender).toBe(UserGender.MALE);
    expect(response.createdAt).toBeInstanceOf(Date);
    expect(response.updatedAt).toBeInstanceOf(Date);
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    const fakeRepo = new FakeUsersRepository();
    const getUserProfileUseCase = new GetUserProfile(fakeRepo);

    const request: GetUserProfileRequest = {
      userId: 'id-inexistente',
    };

    await expect(getUserProfileUseCase.execute(request))
      .rejects
      .toThrow(NotFoundError);
  });

  it('deve lançar erro se o id não for informado', async () => {
    const fakeRepo = new FakeUsersRepository();
    const getUserProfileUseCase = new GetUserProfile(fakeRepo);

    const request: GetUserProfileRequest = {
      userId: '',
    };

    await expect(getUserProfileUseCase.execute(request))
      .rejects
      .toThrow(AppError);
  });
}); 