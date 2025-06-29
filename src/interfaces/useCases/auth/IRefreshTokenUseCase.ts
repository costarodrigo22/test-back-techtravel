import { RefreshTokenRequest, RefreshTokenResponse } from '../../../useCases/auth/RefreshToken';

export interface IRefreshTokenUseCase {
  execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;
} 