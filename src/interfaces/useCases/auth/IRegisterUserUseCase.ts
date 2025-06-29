import { RegisterUserRequest, RegisterUserResponse } from '../../../useCases/auth/RegisterUser';

export interface IRegisterUserUseCase {
  execute(request: RegisterUserRequest): Promise<RegisterUserResponse>;
} 