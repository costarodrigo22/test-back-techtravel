import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { IUsersRepository } from '../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../interfaces/services/IAuthService';

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService implements IAuthService {
  constructor(private usersRepository: IUsersRepository) {}

  async register(name: string, email: string, password: string, gender: string): Promise<AuthResponse> {
    // Verificar se o usuário já existe
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuário já existe com este email');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = new User(name, email, hashedPassword, gender as any);
    await this.usersRepository.create(user);

    // Gerar tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

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

  async login(email: string, password: string): Promise<AuthResponse> {
    // Buscar usuário
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos');
    }

    // Gerar tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

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

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
      
      const user = await this.usersRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const newAccessToken = this.generateAccessToken(user);
      
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Token de refresh inválido');
    }
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET!);
  }

  generateRefreshToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!);
  }
} 