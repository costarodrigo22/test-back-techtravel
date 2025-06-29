import { IContainer } from '../interfaces/container/IContainer';
import { IUsersRepository } from '../interfaces/repositories/IUsersRepository';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IRegisterUserUseCase } from '../interfaces/useCases/auth/IRegisterUserUseCase';
import { ILoginUserUseCase } from '../interfaces/useCases/auth/ILoginUserUseCase';
import { IRefreshTokenUseCase } from '../interfaces/useCases/auth/IRefreshTokenUseCase';
import { IGetUserProfileUseCase } from '../interfaces/useCases/user/IGetUserProfileUseCase';
import { IAuthController } from '../interfaces/controllers/IAuthController';
import { IUserController } from '../interfaces/controllers/IUserController';
import { IRouteFactory } from '../interfaces/routes/IRouteFactory';

import { PrismaUsersRepository } from '../repository/PrismaUsersRepository';
import { AuthService } from '../services/AuthService';
import { RegisterUser } from '../useCases/auth/RegisterUser';
import { LoginUser } from '../useCases/auth/LoginUser';
import { RefreshToken } from '../useCases/auth/RefreshToken';
import { GetUserProfile } from '../useCases/user/GetUserProfile';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { RouteFactory } from '../factories/RouteFactory';

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
    // Check if instance already exists
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    // Check if factory exists
    if (this.factories.has(token)) {
      const factory = this.factories.get(token)!;
      const instance = factory();
      this.instances.set(token, instance);
      return instance;
    }

    // Check if service exists
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
    // Register repositories
    this.register('IUsersRepository', PrismaUsersRepository);

    // Register services
    this.registerFactory('IAuthService', () => {
      const usersRepository = this.resolve<IUsersRepository>('IUsersRepository');
      return new AuthService(usersRepository);
    });

    // Register use cases
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

    // Register controllers
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

    // Register factories
    this.register('IRouteFactory', RouteFactory);
  }
} 