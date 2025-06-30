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
import { CreateFlight } from './useCases/flight/CreateFlight';
import { GetFlightById } from './useCases/flight/GetFlightById';
import { UpdateFlight } from './useCases/flight/UpdateFlight';
import { DeleteFlight } from './useCases/flight/DeleteFlight';
import { ListFlights } from './useCases/flight/ListFlights';
import { CreateAirline } from './useCases/airline/CreateAirline';
import { GetAirlineById } from './useCases/airline/GetAirlineById';
import { UpdateAirline } from './useCases/airline/UpdateAirline';
import { DeleteAirline } from './useCases/airline/DeleteAirline';
import { ListAirlines } from './useCases/airline/ListAirlines';
import { CreateAirport } from './useCases/airport/CreateAirport';
import { GetAirportById } from './useCases/airport/GetAirportById';
import { UpdateAirport } from './useCases/airport/UpdateAirport';
import { DeleteAirport } from './useCases/airport/DeleteAirport';
import { ListAirports } from './useCases/airport/ListAirports';

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
const createFlight = new CreateFlight(flightsRepository);
const getFlightById = new GetFlightById(flightsRepository);
const updateFlight = new UpdateFlight(flightsRepository);
const deleteFlight = new DeleteFlight(flightsRepository);
const listFlights = new ListFlights(flightsRepository);
const flightController = new FlightController(
  createFlight,
  getFlightById,
  updateFlight,
  deleteFlight,
  listFlights
);
const airlinesRepository = new PrismaAirlinesRepository();
const createAirline = new CreateAirline(airlinesRepository);
const getAirlineById = new GetAirlineById(airlinesRepository);
const updateAirline = new UpdateAirline(airlinesRepository);
const deleteAirline = new DeleteAirline(airlinesRepository);
const listAirlines = new ListAirlines(airlinesRepository);
const airlineController = new AirlineController(
  createAirline,
  getAirlineById,
  updateAirline,
  deleteAirline,
  listAirlines
);
const airportsRepository = new PrismaAirportsRepository();
const createAirport = new CreateAirport(airportsRepository);
const getAirportById = new GetAirportById(airportsRepository);
const updateAirport = new UpdateAirport(airportsRepository);
const deleteAirport = new DeleteAirport(airportsRepository);
const listAirports = new ListAirports(airportsRepository);
const airportController = new AirportController(
  createAirport,
  getAirportById,
  updateAirport,
  deleteAirport,
  listAirports
);

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