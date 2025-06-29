import { PrismaClient } from '../generated/prisma';
import { User, UserRole, UserGender } from '../entities/User';
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
        role: user.role as any,
        department: user.department,
        employeeId: user.employeeId,
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

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        gender: user.gender as any,
        role: user.role as any,
        department: user.department,
        employeeId: user.employeeId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async list(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany();
    return prismaUsers.map((user: any) => this.mapPrismaUserToUser(user));
  }

  async findByDepartment(department: string): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: { department },
    });
    return prismaUsers.map((user: any) => this.mapPrismaUserToUser(user));
  }

  private mapPrismaUserToUser(prismaUser: any): User {
    const user = new User(
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.gender as UserGender,
      prismaUser.role as UserRole,
      prismaUser.department || undefined,
      prismaUser.employeeId || undefined
    );
    
    user.id = prismaUser.id;
    user.createdAt = prismaUser.createdAt;
    user.updatedAt = prismaUser.updatedAt;
    
    return user;
  }
} 