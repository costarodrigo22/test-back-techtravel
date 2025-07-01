import { Router } from 'express';
import { IAuthController } from '../interfaces/controllers/IAuthController';
import { IUserController } from '../interfaces/controllers/IUserController';
import { IRouteFactory } from '../interfaces/routes/IRouteFactory';
import { FlightController } from '../controllers/FlightController';
import { AirlineController } from '../controllers/AirlineController';
import { AirportController } from '../controllers/AirportController';
import { ItineraryController } from '../controllers/ItineraryController';
import { AvailabilityController } from '../controllers/AvailabilityController';
import { BookingController } from '../controllers/BookingController';
import { Container } from '../di/Container';

export class RouteFactory implements IRouteFactory {
  private container: Container;

  constructor() {
    this.container = new Container();
  }

  createAuthRoutes(authController: IAuthController): Router {
    const router = Router();

    router.post('/register', async (req, res, next) => {
      try {
        await authController.register(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.post('/login', async (req, res, next) => {
      try {
        await authController.login(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.post('/refresh', async (req, res, next) => {
      try {
        await authController.refreshToken(req, res);
      } catch (error) {
        next(error);
      }
    });

    return router;
  }

  createUserRoutes(userController: IUserController): Router {
    const router = Router();

    router.get('/profile', async (req, res, next) => {
      try {
        await userController.getProfile(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.get('/:userId/bookings', async (req, res, next) => {
      try {
        const bookingController = this.container.resolve('BookingController') as BookingController;
        await bookingController.listUserBookings(req, res);
      } catch (error) {
        next(error);
      }
    });

    return router;
  }

  createFlightRoutes(flightController: FlightController): Router {
    const router = Router();

    router.get('/', async (req, res, next) => {
      try {
        await flightController.list(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.get('/:id', async (req, res, next) => {
      try {
        await flightController.get(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.post('/', async (req, res, next) => {
      try {
        await flightController.create(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.put('/:id', async (req, res, next) => {
      try {
        await flightController.update(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.delete('/:id', async (req, res, next) => {
      try {
        await flightController.delete(req, res);
      } catch (error) {
        next(error);
      }
    });

    return router;
  }

  createAirlineRoutes(airlineController: AirlineController): Router {
    const router = Router();
    
    router.get('/', async (req, res, next) => {
      try {
        await airlineController.list(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.get('/:id', async (req, res, next) => {
      try {
        await airlineController.get(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.post('/', async (req, res, next) => {
      try {
        await airlineController.create(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.put('/:id', async (req, res, next) => {
      try {
        await airlineController.update(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.delete('/:id', async (req, res, next) => {
      try {
        await airlineController.delete(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    return router;
  }

  createAirportRoutes(airportController: AirportController): Router {
    const router = Router();
    
    router.get('/', async (req, res, next) => {
      try {
        await airportController.list(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.get('/:id', async (req, res, next) => {
      try {
        await airportController.get(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.post('/', async (req, res, next) => {
      try {
        await airportController.create(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.put('/:id', async (req, res, next) => {
      try {
        await airportController.update(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.delete('/:id', async (req, res, next) => {
      try {
        await airportController.delete(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    return router;
  }

  createItineraryRoutes(itineraryController: ItineraryController): Router {
    const router = Router();
    
    router.get('/', async (req, res, next) => {
      try {
        await itineraryController.list(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.post('/', async (req, res, next) => {
      try {
        await itineraryController.create(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.get('/:id', async (req, res, next) => {
      try {
        await itineraryController.get(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.delete('/:id', async (req, res, next) => {
      try {
        await itineraryController.delete(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    return router;
  }

  createAvailabilityRoutes(availabilityController: AvailabilityController): Router {
    const router = Router();
    
    router.post('/search', async (req, res, next) => {
      try {
        await availabilityController.search(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    return router;
  }

  createBookingRoutes(bookingController: BookingController): Router {
    const router = Router();
    
    router.post('/', async (req, res, next) => {
      try {
        await bookingController.create(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    router.delete('/:id', async (req, res, next) => {
      try {
        await bookingController.cancel(req, res);
      } catch (error) {
        next(error);
      }
    });
    
    return router;
  }
} 