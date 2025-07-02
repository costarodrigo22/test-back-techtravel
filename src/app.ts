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
import { AirlineController } from './controllers/AirlineController';
import { AirportController } from './controllers/AirportController';
import { ItineraryController } from './controllers/ItineraryController';
import { AvailabilityController } from './controllers/AvailabilityController';
import { BookingController } from './controllers/BookingController';
import { errorHandler } from './middleware/errorHandler';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const container = new Container();

const authController = container.resolve('IAuthController') as IAuthController;
const userController = container.resolve('IUserController') as IUserController;
const routeFactory = container.resolve('IRouteFactory') as IRouteFactory;
const authService = container.resolve('IAuthService') as IAuthService;
const flightController = container.resolve('FlightController') as FlightController;
const airlineController = container.resolve('AirlineController') as AirlineController;
const airportController = container.resolve('AirportController') as AirportController;
const itineraryController = container.resolve('ItineraryController') as ItineraryController;
const availabilityController = container.resolve('AvailabilityController') as AvailabilityController;
const bookingController = container.resolve('BookingController') as BookingController;

app.use('/auth', routeFactory.createAuthRoutes(authController));
app.use('/flights', authMiddleware(authService), routeFactory.createFlightRoutes(flightController));
app.use('/airlines', authMiddleware(authService), routeFactory.createAirlineRoutes(airlineController));
app.use('/airports', authMiddleware(authService), routeFactory.createAirportRoutes(airportController));
app.use('/itineraries', authMiddleware(authService), routeFactory.createItineraryRoutes(itineraryController));
app.use('/availability', authMiddleware(authService), routeFactory.createAvailabilityRoutes(availabilityController));
app.use('/bookings', authMiddleware(authService), routeFactory.createBookingRoutes(bookingController));
app.use('/users', authMiddleware(authService), routeFactory.createUserRoutes(userController));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check da API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API está saudável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 