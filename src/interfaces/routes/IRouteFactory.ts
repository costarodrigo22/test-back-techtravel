import { Router } from 'express';
import { IAuthController } from '../controllers/IAuthController';
import { IUserController } from '../controllers/IUserController';
import { FlightController } from '../../controllers/FlightController';
import { AirlineController } from '../../controllers/AirlineController';
import { AirportController } from '../../controllers/AirportController';
import { ItineraryController } from '../../controllers/ItineraryController';

export interface IRouteFactory {
  createAuthRoutes(authController: IAuthController): Router;
  createUserRoutes(userController: IUserController): Router;
  createFlightRoutes(flightController: FlightController): Router;
  createAirlineRoutes(airlineController: AirlineController): Router;
  createAirportRoutes(airportController: AirportController): Router;
  createItineraryRoutes(itineraryController: ItineraryController): Router;
} 