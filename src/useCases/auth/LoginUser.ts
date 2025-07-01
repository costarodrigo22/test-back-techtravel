import bcrypt from 'bcryptjs';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../interfaces/services/IAuthService';
import { ILoginUserUseCase } from '../../interfaces/useCases/auth/ILoginUserUseCase';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginUserRequest = z.infer<typeof LoginUserSchema>;

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
    // Validação centralizada com zod
    const parsed = LoginUserSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    // Buscar usuário
    const user = await this.usersRepository.findByEmail(request.email);
    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(request.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Email ou senha inválidos', 401);
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
} 