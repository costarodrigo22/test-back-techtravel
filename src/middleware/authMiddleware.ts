import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../interfaces/services/IAuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(authService: IAuthService) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const token = authHeader.replace('Bearer ', '');
      
      const decoded = authService.verifyToken(token);
      req.user = decoded;
      
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
} 