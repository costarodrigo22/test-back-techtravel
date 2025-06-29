import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Container } from './di/Container';
import { IAuthController } from './interfaces/controllers/IAuthController';
import { IUserController } from './interfaces/controllers/IUserController';
import { IRouteFactory } from './interfaces/routes/IRouteFactory';
import { IAuthService } from './interfaces/services/IAuthService';
import { authMiddleware } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection Container
const container = new Container();

// Resolve dependencies
const authController = container.resolve<IAuthController>('IAuthController');
const userController = container.resolve<IUserController>('IUserController');
const routeFactory = container.resolve<IRouteFactory>('IRouteFactory');
const authService = container.resolve<IAuthService>('IAuthService');

// Routes
app.use('/auth', routeFactory.createAuthRoutes(authController));
app.use('/users', authMiddleware(authService), routeFactory.createUserRoutes(userController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 