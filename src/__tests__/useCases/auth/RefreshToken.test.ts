import { RefreshToken, RefreshTokenRequest } from '../../../useCases/auth/RefreshToken';
import { IUsersRepository } from '../../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../../interfaces/services/IAuthService';
import { User, UserGender } from '../../../entities/User';
import jwt from 'jsonwebtoken';
import { AppError } from '../../../errors/AppError';
import { NotFoundError } from '../../../errors/NotFoundError';

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

describe('RefreshToken UseCase', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve gerar um novo access token com refresh token válido', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const refreshTokenUseCase = new RefreshToken(fakeRepo, fakeAuthService);

    const user = new User('João', 'joao@email.com', 'senha123', UserGender.MALE);
    await fakeRepo.create(user);

    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ userId: user.id, email: user.email }));

    const request: RefreshTokenRequest = {
      refreshToken: 'valid-refresh-token',
    };

    const response = await refreshTokenUseCase.execute(request);
    expect(response.accessToken).toBe('fake-access-token');
  });

  it('deve lançar erro se refresh token for inválido', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const refreshTokenUseCase = new RefreshToken(fakeRepo, fakeAuthService);

    jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('Token inválido'); });

    const request: RefreshTokenRequest = {
      refreshToken: 'invalid-refresh-token',
    };

    await expect(refreshTokenUseCase.execute(request))
      .rejects
      .toThrow(AppError);
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const refreshTokenUseCase = new RefreshToken(fakeRepo, fakeAuthService);

    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ userId: 'naoexiste', email: 'x@email.com' }));

    const request: RefreshTokenRequest = {
      refreshToken: 'valid-refresh-token',
    };

    await expect(refreshTokenUseCase.execute(request))
      .rejects
      .toThrow(NotFoundError);
  });

  it('deve lançar erro se refresh token não for informado', async () => {
    const fakeRepo = new FakeUsersRepository();
    const fakeAuthService = new FakeAuthService();
    const refreshTokenUseCase = new RefreshToken(fakeRepo, fakeAuthService);

    const request: RefreshTokenRequest = {
      refreshToken: '',
    };

    await expect(refreshTokenUseCase.execute(request))
      .rejects
      .toThrow(AppError);
  });
}); 