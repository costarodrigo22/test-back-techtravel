import { Flight } from '../../entities/Flight';
import { IFlightsRepository } from '../../interfaces/repositories/IFlightsRepository';
import { randomUUID } from 'crypto';

export interface CreateFlightRequest {
  flight_number: string;
  airline_id: string;
  origin_iata: string;
  destination_iata: string;
  departure_datetime: Date;
  arrival_datetime: Date;
  frequency: number[];
}

export class CreateFlight {
  constructor(private flightsRepository: IFlightsRepository) {}

  async execute(request: CreateFlightRequest): Promise<Flight> {
    const flight = new Flight(
      randomUUID(),
      request.flight_number,
      request.airline_id,
      request.origin_iata,
      request.destination_iata,
      request.departure_datetime,
      request.arrival_datetime,
      request.frequency
    );
    return this.flightsRepository.create(flight);
  }
} 