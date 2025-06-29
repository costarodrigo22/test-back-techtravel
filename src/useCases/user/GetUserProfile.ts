import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IGetUserProfileUseCase } from '../../interfaces/useCases/user/IGetUserProfileUseCase';

export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  id: string;
  name: string;
  email: string;
  gender: string;
  role: string;
  department?: string;
  employeeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetUserProfile implements IGetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(request: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    // Validar dados de entrada
    this.validateRequest(request);

    // Buscar usuário
    const user = await this.usersRepository.findById(request.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Retornar dados do usuário (sem a senha)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private validateRequest(request: GetUserProfileRequest): void {
    if (!request.userId || request.userId.trim().length === 0) {
      throw new Error('ID do usuário é obrigatório');
    }
  }
} 