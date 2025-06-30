import { Airport } from '../../entities/Airport';
import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';
import { randomUUID } from 'crypto';

export interface CreateAirportRequest {
  name: string;
  iata_code: string;
}

export class CreateAirport {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(request: CreateAirportRequest): Promise<Airport> {
    const airport = new Airport(randomUUID(), request.name, request.iata_code);
    return this.airportsRepository.create(airport);
  }
} 