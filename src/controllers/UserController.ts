import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { GetUserProfile } from '../useCases/user/GetUserProfile';
import { IUserController } from '../interfaces/controllers/IUserController';

export class UserController implements IUserController {
  constructor(private getUserProfile: GetUserProfile) {}

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const result = await this.getUserProfile.execute({
        userId: req.user.userId,
      });
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 