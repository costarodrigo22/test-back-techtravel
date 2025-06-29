import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export interface IUserController {
  getProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
} 