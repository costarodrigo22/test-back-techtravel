import { GetUserProfileRequest, GetUserProfileResponse } from '../../../useCases/user/GetUserProfile';

export interface IGetUserProfileUseCase {
  execute(request: GetUserProfileRequest): Promise<GetUserProfileResponse>;
} 