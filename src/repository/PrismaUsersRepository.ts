import { PrismaClient } from '../generated/prisma';
import { User, UserGender } from '../entities/User';
import { IUsersRepository } from '../interfaces/repositories/IUsersRepository';

export class PrismaUsersRepository implements IUsersRepository {
  private prisma = new PrismaClient();

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        gender: user.gender as any,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) return null;

    return this.mapPrismaUserToUser(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) return null;

    return this.mapPrismaUserToUser(prismaUser);
  }



  private mapPrismaUserToUser(prismaUser: any): User {
    const user = new User(
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.gender as UserGender
    );
    
    user.id = prismaUser.id;
    user.createdAt = prismaUser.createdAt;
    user.updatedAt = prismaUser.updatedAt;
    
    return user;
  }
} 