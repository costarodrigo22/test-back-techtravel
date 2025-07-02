import { IContainer } from '../interfaces/container/IContainer';
import { IUsersRepository } from '../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../interfaces/services/IAuthService';

import { PrismaUsersRepository } from '../repository/PrismaUsersRepository';
import { AuthService } from '../services/AuthService';
import { RegisterUser } from '../useCases/auth/RegisterUser';
import { LoginUser } from '../useCases/auth/LoginUser';
import { RefreshToken } from '../useCases/auth/RefreshToken';
import { GetUserProfile } from '../useCases/user/GetUserProfile';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { RouteFactory } from '../factories/RouteFactory';
import { PrismaFlightsRepository } from '../repository/PrismaFlightsRepository';
import { PrismaAirlinesRepository } from '../repository/PrismaAirlinesRepository';
import { PrismaAirportsRepository } from '../repository/PrismaAirportsRepository';
import { PrismaItinerariesRepository } from '../repository/PrismaItinerariesRepository';
import { PrismaBookingsRepository } from '../repository/PrismaBookingsRepository';
import { CreateFlight } from '../useCases/flight/CreateFlight';
import { GetFlightById } from '../useCases/flight/GetFlightById';
import { UpdateFlight } from '../useCases/flight/UpdateFlight';
import { DeleteFlight } from '../useCases/flight/DeleteFlight';
import { ListFlights } from '../useCases/flight/ListFlights';
import { FlightController } from '../controllers/FlightController';
import { CreateAirline } from '../useCases/airline/CreateAirline';
import { GetAirlineById } from '../useCases/airline/GetAirlineById';
import { UpdateAirline } from '../useCases/airline/UpdateAirline';
import { DeleteAirline } from '../useCases/airline/DeleteAirline';
import { ListAirlines } from '../useCases/airline/ListAirlines';
import { AirlineController } from '../controllers/AirlineController';
import { CreateAirport } from '../useCases/airport/CreateAirport';
import { GetAirportById } from '../useCases/airport/GetAirportById';
import { UpdateAirport } from '../useCases/airport/UpdateAirport';
import { DeleteAirport } from '../useCases/airport/DeleteAirport';
import { ListAirports } from '../useCases/airport/ListAirports';
import { AirportController } from '../controllers/AirportController';
import { ListItineraries } from '../useCases/itinerary/ListItineraries';
import { CreateItinerary } from '../useCases/itinerary/CreateItinerary';
import { GetItineraryById } from '../useCases/itinerary/GetItineraryById';
import { DeleteItinerary } from '../useCases/itinerary/DeleteItinerary';
import { ItineraryController } from '../controllers/ItineraryController';
import { SearchAvailability } from '../useCases/availability/SearchAvailability';
import { AvailabilityController } from '../controllers/AvailabilityController';
import { CreateBooking } from '../useCases/booking/CreateBooking';
import { GetUserBookings } from '../useCases/booking/GetUserBookings';
import { CancelBooking } from '../useCases/booking/CancelBooking';
import { BookingController } from '../controllers/BookingController';

type Constructor<T> = new (...args: any[]) => T;
type DependencyResolver<T> = () => T;

export class Container implements IContainer {
  private readonly services: Map<string, Constructor<any>> = new Map();
  private readonly instances: Map<string, any> = new Map();
  private readonly factories: Map<string, DependencyResolver<any>> = new Map();

  constructor() {
    this.registerDefaultServices();
  }

  register<T>(token: string, implementation: Constructor<T>): void {
    if (this.services.has(token)) {
      throw new Error(`"${token}" is already registered.`);
    }

    this.services.set(token, implementation);
  }

  registerFactory<T>(token: string, factory: DependencyResolver<T>): void {
    if (this.factories.has(token)) {
      throw new Error(`"${token}" factory is already registered.`);
    }

    this.factories.set(token, factory);
  }

  resolve<T>(token: string): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    if (this.factories.has(token)) {
      const factory = this.factories.get(token)!;
      const instance = factory();
      this.instances.set(token, instance);
      return instance;
    }

    const implementation = this.services.get(token);
    if (!implementation) {
      throw new Error(`"${token}" is not registered.`);
    }

    const instance = new implementation();
    this.instances.set(token, instance);
    return instance;
  }

  has(token: string): boolean {
    return this.services.has(token) || this.factories.has(token);
  }

  private registerDefaultServices(): void {
    this.register('IUsersRepository', PrismaUsersRepository);
    this.register('IFlightsRepository', PrismaFlightsRepository);
    this.register('IAirlinesRepository', PrismaAirlinesRepository);
    this.register('IAirportsRepository', PrismaAirportsRepository);
    this.register('IItinerariesRepository', PrismaItinerariesRepository);
    this.register('IBookingsRepository', PrismaBookingsRepository);

    this.registerFactory('IAuthService', () => {
      const usersRepository = this.resolve<IUsersRepository>('IUsersRepository');
      return new AuthService(usersRepository);
    });

    this.registerFactory('IRegisterUserUseCase', () => {
      const usersRepository = this.resolve<IUsersRepository>('IUsersRepository');
      const authService = this.resolve<IAuthService>('IAuthService');
      return new RegisterUser(usersRepository, authService);
    });

    this.registerFactory('ILoginUserUseCase', () => {
      const usersRepository = this.resolve<IUsersRepository>('IUsersRepository');
      const authService = this.resolve<IAuthService>('IAuthService');
      return new LoginUser(usersRepository, authService);
    });

    this.registerFactory('IRefreshTokenUseCase', () => {
      const usersRepository = this.resolve<IUsersRepository>('IUsersRepository');
      const authService = this.resolve<IAuthService>('IAuthService');
      return new RefreshToken(usersRepository, authService);
    });

    this.registerFactory('IGetUserProfileUseCase', () => {
      const usersRepository = this.resolve<IUsersRepository>('IUsersRepository');
      return new GetUserProfile(usersRepository);
    });

    this.registerFactory('CreateFlight', () => new CreateFlight(this.resolve('IFlightsRepository')));
    this.registerFactory('GetFlightById', () => new GetFlightById(this.resolve('IFlightsRepository')));
    this.registerFactory('UpdateFlight', () => new UpdateFlight(this.resolve('IFlightsRepository')));
    this.registerFactory('DeleteFlight', () => new DeleteFlight(this.resolve('IFlightsRepository')));
    this.registerFactory('ListFlights', () => new ListFlights(this.resolve('IFlightsRepository')));

    this.registerFactory('CreateAirline', () => new CreateAirline(this.resolve('IAirlinesRepository')));
    this.registerFactory('GetAirlineById', () => new GetAirlineById(this.resolve('IAirlinesRepository')));
    this.registerFactory('UpdateAirline', () => new UpdateAirline(this.resolve('IAirlinesRepository')));
    this.registerFactory('DeleteAirline', () => new DeleteAirline(this.resolve('IAirlinesRepository')));
    this.registerFactory('ListAirlines', () => new ListAirlines(this.resolve('IAirlinesRepository')));

    this.registerFactory('CreateAirport', () => new CreateAirport(this.resolve('IAirportsRepository')));
    this.registerFactory('GetAirportById', () => new GetAirportById(this.resolve('IAirportsRepository')));
    this.registerFactory('UpdateAirport', () => new UpdateAirport(this.resolve('IAirportsRepository')));
    this.registerFactory('DeleteAirport', () => new DeleteAirport(this.resolve('IAirportsRepository')));
    this.registerFactory('ListAirports', () => new ListAirports(this.resolve('IAirportsRepository')));

    this.registerFactory('ListItineraries', () => new ListItineraries(this.resolve('IItinerariesRepository')));
    this.registerFactory('CreateItinerary', () => new CreateItinerary(this.resolve('IItinerariesRepository'), this.resolve('IFlightsRepository')));
    this.registerFactory('GetItineraryById', () => new GetItineraryById(this.resolve('IItinerariesRepository')));
    this.registerFactory('DeleteItinerary', () => new DeleteItinerary(this.resolve('IItinerariesRepository')));

    this.registerFactory('SearchAvailability', () => new SearchAvailability(this.resolve('IItinerariesRepository')));

    this.registerFactory('CreateBooking', () => new CreateBooking(this.resolve('IBookingsRepository'), this.resolve('IUsersRepository'), this.resolve('IItinerariesRepository')));
    this.registerFactory('GetUserBookings', () => new GetUserBookings(this.resolve('IBookingsRepository'), this.resolve('IUsersRepository')));
    this.registerFactory('CancelBooking', () => new CancelBooking(this.resolve('IBookingsRepository')));

    this.registerFactory('IAuthController', () => {
      const registerUser = this.resolve<RegisterUser>('IRegisterUserUseCase');
      const loginUser = this.resolve<LoginUser>('ILoginUserUseCase');
      const refreshToken = this.resolve<RefreshToken>('IRefreshTokenUseCase');
      return new AuthController(registerUser, loginUser, refreshToken);
    });

    this.registerFactory('IUserController', () => {
      const getUserProfile = this.resolve<GetUserProfile>('IGetUserProfileUseCase');
      return new UserController(getUserProfile);
    });

    this.registerFactory('FlightController', () => new FlightController(
      this.resolve('CreateFlight'),
      this.resolve('GetFlightById'),
      this.resolve('UpdateFlight'),
      this.resolve('DeleteFlight'),
      this.resolve('ListFlights')
    ));

    this.registerFactory('AirlineController', () => new AirlineController(
      this.resolve('CreateAirline'),
      this.resolve('GetAirlineById'),
      this.resolve('UpdateAirline'),
      this.resolve('DeleteAirline'),
      this.resolve('ListAirlines')
    ));

    this.registerFactory('AirportController', () => new AirportController(
      this.resolve('CreateAirport'),
      this.resolve('GetAirportById'),
      this.resolve('UpdateAirport'),
      this.resolve('DeleteAirport'),
      this.resolve('ListAirports')
    ));

    this.registerFactory('ItineraryController', () => new ItineraryController(
      this.resolve('ListItineraries'),
      this.resolve('CreateItinerary'),
      this.resolve('GetItineraryById'),
      this.resolve('DeleteItinerary')
    ));

    this.registerFactory('AvailabilityController', () => new AvailabilityController(this.resolve('SearchAvailability')));

    this.registerFactory('BookingController', () => new BookingController(this.resolve('CreateBooking'), this.resolve('GetUserBookings'), this.resolve('CancelBooking')));

    this.register('IRouteFactory', RouteFactory);
  }
} 