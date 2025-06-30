import bcrypt from 'bcryptjs';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../interfaces/services/IAuthService';
import { ILoginUserUseCase } from '../../interfaces/useCases/auth/ILoginUserUseCase';

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class LoginUser implements ILoginUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private authService: IAuthService
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    // Validar dados de entrada
    this.validateRequest(request);

    // Buscar usuário
    const user = await this.usersRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(request.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos');
    }

    // Gerar tokens
    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  private validateRequest(request: LoginUserRequest): void {
    if (!request.email || !this.isValidEmail(request.email)) {
      throw new Error('Email inválido');
    }

    if (!request.password || request.password.length < 1) {
      throw new Error('Senha é obrigatória');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 