import { IUsersRepository } from '../../interfaces/repositories/IUsersRepository';
import { IGetUserProfileUseCase } from '../../interfaces/useCases/user/IGetUserProfileUseCase';
import { AppError } from '../../errors/AppError';
import { NotFoundError } from '../../errors/NotFoundError';
import { z } from 'zod';

export const GetUserProfileSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
});

export type GetUserProfileRequest = z.infer<typeof GetUserProfileSchema>;

export interface GetUserProfileResponse {
  id: string;
  name: string;
  email: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetUserProfile implements IGetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(request: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    // Validação centralizada com zod
    const parsed = GetUserProfileSchema.safeParse(request);
    if (!parsed.success) {
      const message = parsed.error.errors.map(e => e.message).join('; ');
      throw new AppError(message, 400);
    }

    // Buscar usuário
    const user = await this.usersRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Retornar dados do usuário (sem a senha)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 