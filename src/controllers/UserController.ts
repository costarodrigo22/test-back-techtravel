import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { GetUserProfile } from '../useCases/user/GetUserProfile';
import { IUserController } from '../interfaces/controllers/IUserController';
import { AppError } from '../errors/AppError';

export class UserController implements IUserController {
  constructor(private getUserProfile: GetUserProfile) {}

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const result = await this.getUserProfile.execute({
      userId: req.user.userId,
    });
    
    res.status(200).json(result);
  }
} 