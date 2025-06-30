import { Router } from 'express';
import { IAuthController } from '../interfaces/controllers/IAuthController';
import { IUserController } from '../interfaces/controllers/IUserController';
import { IRouteFactory } from '../interfaces/routes/IRouteFactory';
import { FlightController } from '../controllers/FlightController';
import { AirlineController } from '../controllers/AirlineController';
import { AirportController } from '../controllers/AirportController';
import { ItineraryController } from '../controllers/ItineraryController';

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

  createFlightRoutes(flightController: FlightController): Router {
    const router = Router();

    router.get('/', (req, res) => flightController.list(req, res));
    router.get('/:id', (req, res) => flightController.get(req, res));
    router.post('/', (req, res) => flightController.create(req, res));
    router.put('/:id', (req, res) => flightController.update(req, res));
    router.delete('/:id', (req, res) => flightController.delete(req, res));

    return router;
  }

  createAirlineRoutes(airlineController: AirlineController): Router {
    const router = Router();
    router.get('/', (req, res) => airlineController.list(req, res));
    router.get('/:id', (req, res) => airlineController.get(req, res));
    router.post('/', (req, res) => airlineController.create(req, res));
    router.put('/:id', (req, res) => airlineController.update(req, res));
    router.delete('/:id', (req, res) => airlineController.delete(req, res));
    return router;
  }

  createAirportRoutes(airportController: AirportController): Router {
    const router = Router();
    router.get('/', (req, res) => airportController.list(req, res));
    router.get('/:id', (req, res) => airportController.get(req, res));
    router.post('/', (req, res) => airportController.create(req, res));
    router.put('/:id', (req, res) => airportController.update(req, res));
    router.delete('/:id', (req, res) => airportController.delete(req, res));
    return router;
  }

  createItineraryRoutes(itineraryController: ItineraryController): Router {
    const router = Router();
    router.get('/', (req, res) => itineraryController.list(req, res));
    router.post('/', (req, res) => itineraryController.create(req, res));
    router.get('/:id', (req, res) => itineraryController.get(req, res));
    router.delete('/:id', (req, res) => itineraryController.delete(req, res));
    return router;
  }
} 