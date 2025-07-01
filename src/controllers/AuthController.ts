import { Request, Response } from 'express';
import { RegisterUser } from '../useCases/auth/RegisterUser';
import { LoginUser } from '../useCases/auth/LoginUser';
import { RefreshToken } from '../useCases/auth/RefreshToken';
import { IAuthController } from '../interfaces/controllers/IAuthController';

export class AuthController implements IAuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private refreshTokenUseCase: RefreshToken
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password, gender } = req.body;

    const result = await this.registerUser.execute({
      name,
      email,
      password,
      gender,
    });
    
    res.status(201).json(result);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const result = await this.loginUser.execute({
      email,
      password,
    });
    
    res.status(200).json(result);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    const result = await this.refreshTokenUseCase.execute({
      refreshToken,
    });
    
    res.status(200).json(result);
  }
} 