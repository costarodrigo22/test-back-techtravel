import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Container } from './di/Container';
import { IAuthController } from './interfaces/controllers/IAuthController';
import { IUserController } from './interfaces/controllers/IUserController';
import { IRouteFactory } from './interfaces/routes/IRouteFactory';
import { IAuthService } from './interfaces/services/IAuthService';
import { authMiddleware } from './middleware/authMiddleware';
import { FlightController } from './controllers/FlightController';
import { PrismaFlightsRepository } from './repository/PrismaFlightsRepository';
import { PrismaAirlinesRepository } from './repository/PrismaAirlinesRepository';
import { PrismaAirportsRepository } from './repository/PrismaAirportsRepository';
import { AirlineController } from './controllers/AirlineController';
import { AirportController } from './controllers/AirportController';

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
const flightsRepository = new PrismaFlightsRepository();
const flightController = new FlightController(flightsRepository);
const airlinesRepository = new PrismaAirlinesRepository();
const airlineController = new AirlineController(airlinesRepository);
const airportsRepository = new PrismaAirportsRepository();
const airportController = new AirportController(airportsRepository);

// Routes
app.use('/auth', routeFactory.createAuthRoutes(authController));
app.use('/users', authMiddleware(authService), routeFactory.createUserRoutes(userController));
app.use('/flights', authMiddleware(authService), routeFactory.createFlightRoutes(flightController));
app.use('/airlines', authMiddleware(authService), routeFactory.createAirlineRoutes(airlineController));
app.use('/airports', authMiddleware(authService), routeFactory.createAirportRoutes(airportController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 