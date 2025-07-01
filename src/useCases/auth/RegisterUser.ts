import bcrypt from 'bcryptjs';
import { User, UserGender } from '../../entities/User';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../interfaces/services/IAuthService';
import { IRegisterUserUseCase } from '../../interfaces/useCases/auth/IRegisterUserUseCase';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  gender: z.nativeEnum(UserGender, {
    errorMap: () => ({ message: `Gênero inválido. Valores válidos: ${Object.values(UserGender).join(', ')}` })
  })
});

export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;

export interface RegisterUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
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
    // Validação centralizada com zod
    const parsed = RegisterUserSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    // Verificar se o usuário já existe
    const existingUser = await this.usersRepository.findByEmail(request.email);
    if (existingUser) {
      throw new AppError('Usuário já existe com este email', 400);
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
      },
      accessToken,
      refreshToken,
    };
  }
} 