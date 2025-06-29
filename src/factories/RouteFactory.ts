import { Router } from 'express';
import { IAuthController } from '../interfaces/controllers/IAuthController';
import { IUserController } from '../interfaces/controllers/IUserController';
import { IRouteFactory } from '../interfaces/routes/IRouteFactory';

export class RouteFactory implements IRouteFactory {
  createAuthRoutes(authController: IAuthController): Router {
    const router = Router();

    router.post('/register', (req, res) => authController.register(req, res));
    router.post('/login', (req, res) => authController.login(req, res));
    router.post('/refresh', (req, res) => authController.refreshToken(req, res));

    return router;
  }

  createUserRoutes(userController: IUserController): Router {
    const router = Router();

    router.get('/profile', (req, res) => userController.getProfile(req, res));

    return router;
  }
} 