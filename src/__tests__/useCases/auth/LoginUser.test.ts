import { LoginUser, LoginUserRequest } from '../../../useCases/auth/LoginUser';
import { IUsersRepository } from '../../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../../interfaces/services/IAuthService';
import { User, UserGender } from '../../../entities/User';
import bcrypt from 'bcryptjs';
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

describe('LoginUser UseCase', () => {
  beforeAll(() => {
    jest.spyOn(bcrypt, 'compare' ).mockImplementation(async (pass, hash) => {
      return pass === 'senha123' && hash === 'hashedsenha123';
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('deve logar um usuário com credenciais válidas', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const loginUserUseCase = new LoginUser(fakeRepo, fakeAuthService);

    const user = new User('João', 'joao@email.com', 'hashedsenha123', UserGender.MALE);
    await fakeRepo.create(user);

    const loginData: LoginUserRequest = {
      email: 'joao@email.com',
      password: 'senha123',
    };

    const response = await loginUserUseCase.execute(loginData);

    expect(response.user).toHaveProperty('id');
    expect(response.user.name).toBe('João');
    expect(response.user.email).toBe('joao@email.com');
    expect(response.accessToken).toBe('fake-access-token');
    expect(response.refreshToken).toBe('fake-refresh-token');
  });

  it('não deve logar com senha incorreta', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const loginUserUseCase = new LoginUser(fakeRepo, fakeAuthService);

    const user = new User('Maria', 'maria@email.com', 'hashedsenha123', UserGender.FEMALE);
    await fakeRepo.create(user);

    const loginData: LoginUserRequest = {
      email: 'maria@email.com',
      password: 'senhaerrada',
    };

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);

    await expect(loginUserUseCase.execute(loginData))
      .rejects
      .toThrow(AppError);
  });

  it('não deve logar usuário inexistente', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const loginUserUseCase = new LoginUser(fakeRepo, fakeAuthService);

    const loginData: LoginUserRequest = {
      email: 'naoexiste@email.com',
      password: 'senha123',
    };

    await expect(loginUserUseCase.execute(loginData))
      .rejects
      .toThrow(AppError);
  });
}); 