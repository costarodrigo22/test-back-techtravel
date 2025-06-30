import { Airport } from '../../entities/Airport';
import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';

export class ListAirports {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(): Promise<Airport[]> {
    return this.airportsRepository.findAll();
  }
} 