import { Airport } from '../../entities/Airport';

export interface IAirportsRepository {
  create(airport: Airport): Promise<Airport>;
  findById(id: string): Promise<Airport | null>;
  findAll(): Promise<Airport[]>;
  update(id: string, airport: Partial<Airport>): Promise<Airport | null>;
  delete(id: string): Promise<void>;
} 