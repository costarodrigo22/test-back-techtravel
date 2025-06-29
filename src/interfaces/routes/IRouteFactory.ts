import { Router } from 'express';
import { IAuthController } from '../controllers/IAuthController';
import { IUserController } from '../controllers/IUserController';

export interface IRouteFactory {
  createAuthRoutes(authController: IAuthController): Router;
  createUserRoutes(userController: IUserController): Router;
} 