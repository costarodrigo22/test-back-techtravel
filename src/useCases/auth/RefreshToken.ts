import jwt from 'jsonwebtoken';
import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../../interfaces/services/IAuthService';
import { IRefreshTokenUseCase } from '../../interfaces/useCases/auth/IRefreshTokenUseCase';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export class RefreshToken implements IRefreshTokenUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private authService: IAuthService
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    // Validar dados de entrada
    this.validateRequest(request);

    try {
      // Verificar e decodificar o refresh token
      const decoded = jwt.verify(request.refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      
      // Buscar usuário
      const user = await this.usersRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Gerar novo access token
      const newAccessToken = this.authService.generateAccessToken(user);
      
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Token de refresh inválido');
    }
  }

  private validateRequest(request: RefreshTokenRequest): void {
    if (!request.refreshToken || request.refreshToken.trim().length === 0) {
      throw new Error('Refresh token é obrigatório');
    }
  }
} 