import { Airline } from '../../entities/Airline';
import { IAirlinesRepository } from '../../interfaces/repositories/IAirlinesRepository';
import { randomUUID } from 'crypto';

export interface CreateAirlineRequest {
  name: string;
  iata_code: string;
}

export class CreateAirline {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async execute(request: CreateAirlineRequest): Promise<Airline> {
    const airline = new Airline(randomUUID(), request.name, request.iata_code);
    return this.airlinesRepository.create(airline);
  }
} 