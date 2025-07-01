import { RegisterUser, RegisterUserRequest } from '../../../useCases/auth/RegisterUser';
import { IUsersRepository } from '../../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../../interfaces/services/IAuthService';
import { User, UserGender } from '../../../entities/User';

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

class FakeAuthService implements IAuthService {
  login(): any { throw new Error('not implemented'); }
  refreshToken(): any { throw new Error('not implemented'); }
  verifyToken(): any { throw new Error('not implemented'); }
  generateAccessToken(user: User): string {
    return 'fake-access-token';
  }
  generateRefreshToken(user: User): string {
    return 'fake-refresh-token';
  }
}

describe('RegisterUser UseCase', () => {
  it('deve criar um novo usuário se o e-mail não estiver cadastrado', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const registerUserUseCase = new RegisterUser(fakeRepo, fakeAuthService);

    const userData: RegisterUserRequest = {
      name: 'João',
      email: 'joao@email.com',
      password: 'senha123',
      gender: UserGender.MALE
    };

    const response = await registerUserUseCase.execute(userData);

    expect(response.user).toHaveProperty('id');
    expect(response.user.name).toBe('João');
    expect(response.user.email).toBe('joao@email.com');
    expect(response.accessToken).toBe('fake-access-token');
    expect(response.refreshToken).toBe('fake-refresh-token');
  });

  it('não deve permitir criar usuário com e-mail já cadastrado', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const registerUserUseCase = new RegisterUser(fakeRepo, fakeAuthService);

    const userData: RegisterUserRequest = {
      name: 'Maria',
      email: 'maria@email.com',
      password: 'senha123',
      gender: UserGender.FEMALE
    };

    await registerUserUseCase.execute(userData);

    await expect(registerUserUseCase.execute(userData))
      .rejects
      .toThrow('Usuário já existe com este email');
  });
});
