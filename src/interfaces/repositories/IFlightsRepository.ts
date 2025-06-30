import { Flight } from '../../entities/Flight';

export interface IFlightsRepository {
  create(flight: Flight): Promise<Flight>;
  findById(id: string): Promise<Flight | null>;
  findAll(filters?: {
    airline_code?: string;
    origin?: string;
    destination?: string;
  }): Promise<Flight[]>;
  update(id: string, flight: Partial<Flight>): Promise<Flight | null>;
  delete(id: string): Promise<void>;
} 