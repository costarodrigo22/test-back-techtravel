import { LoginUserRequest, LoginUserResponse } from '../../../useCases/auth/LoginUser';

export interface ILoginUserUseCase {
  execute(request: LoginUserRequest): Promise<LoginUserResponse>;
} 