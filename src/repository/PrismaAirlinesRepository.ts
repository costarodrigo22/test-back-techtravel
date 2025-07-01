import { PrismaClient } from '../generated/prisma';
import { Airline } from '../entities/Airline';
import { IAirlinesRepository } from '../interfaces/repositories/IAirlinesRepository';
import { AppError } from '../errors/AppError';

export class PrismaAirlinesRepository implements IAirlinesRepository {
  private prisma = new PrismaClient();

  async create(airline: Airline): Promise<Airline> {
    try {
      const created = await this.prisma.airline.create({
        data: {
          id: airline.id,
          name: airline.name,
          iata_code: airline.iata_code,
        },
      });
      return this.mapPrismaToAirline(created);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new AppError('Já existe uma companhia aérea com esse código IATA.', 409);
      }
      throw new AppError('Erro ao criar companhia aérea.', 500);
    }
  }

  async findById(id: string): Promise<Airline | null> {
    const found = await this.prisma.airline.findUnique({ where: { id } });
    return found ? this.mapPrismaToAirline(found) : null;
  }

  async findAll(): Promise<Airline[]> {
    const airlines = await this.prisma.airline.findMany();
    return airlines.map(this.mapPrismaToAirline);
  }

  async update(id: string, airline: Partial<Airline>): Promise<Airline | null> {
    const updated = await this.prisma.airline.update({
      where: { id },
      data: airline,
    });
    return updated ? this.mapPrismaToAirline(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.airline.delete({ where: { id } });
  }

  private mapPrismaToAirline(prismaAirline: any): Airline {
    return new Airline(
      prismaAirline.id,
      prismaAirline.name,
      prismaAirline.iata_code
    );
  }
} 