import bcrypt from 'bcryptjs';
import { User, UserGender } from '../../entities/User';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../interfaces/services/IAuthService';
import { IRegisterUserUseCase } from '../../interfaces/useCases/auth/IRegisterUserUseCase';

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  gender: string;
}

export interface RegisterUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class RegisterUser implements IRegisterUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private authService: IAuthService
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    // Validar dados de entrada
    this.validateRequest(request);

    // Verificar se o usuário já existe
    const existingUser = await this.usersRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('Usuário já existe com este email');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(request.password, 10);

    // Criar usuário
    const user = new User(
      request.name,
      request.email,
      hashedPassword,
      request.gender as UserGender
    );

    await this.usersRepository.create(user);

    // Gerar tokens
    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  private validateRequest(request: RegisterUserRequest): void {
    if (!request.name || request.name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!request.email || !this.isValidEmail(request.email)) {
      throw new Error('Email inválido');
    }

    if (!request.password || request.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    if (!request.gender || !Object.values(UserGender).includes(request.gender as UserGender)) {
      throw new Error('Gênero inválido');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 