import { User } from '../../entities/User';
import { TokenPayload, AuthResponse } from '../../services/AuthService';

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
  verifyToken(token: string): TokenPayload;
  generateAccessToken(user: User): string;
  generateRefreshToken(user: User): string;
} 