import { Airline } from '../../entities/Airline';

export interface IAirlinesRepository {
  create(airline: Airline): Promise<Airline>;
  findById(id: string): Promise<Airline | null>;
  findAll(): Promise<Airline[]>;
  update(id: string, airline: Partial<Airline>): Promise<Airline | null>;
  delete(id: string): Promise<void>;
} 