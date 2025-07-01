import jwt from 'jsonwebtoken';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../interfaces/services/IAuthService';
import { IRefreshTokenUseCase } from '../../interfaces/useCases/auth/IRefreshTokenUseCase';
import { AppError } from '../../errors/AppError';
import { NotFoundError } from '../../errors/NotFoundError';
import { z } from 'zod';

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenSchema>;

export interface RefreshTokenResponse {
  accessToken: string;
}

export class RefreshToken implements IRefreshTokenUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private authService: IAuthService
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    // Validação centralizada com zod
    const parsed = RefreshTokenSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    try {
      // Verificar e decodificar o refresh token
      const decoded = jwt.verify(request.refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      
      // Buscar usuário
      const user = await this.usersRepository.findById(decoded.userId);
      if (!user) {
        throw new NotFoundError('Usuário não encontrado');
      }

      // Gerar novo access token
      const newAccessToken = this.authService.generateAccessToken(user);
      
      return { accessToken: newAccessToken };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Token de refresh inválido', 401);
    }
  }
} 