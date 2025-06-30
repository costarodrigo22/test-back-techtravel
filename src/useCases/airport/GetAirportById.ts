import { Airport } from '../../entities/Airport';
import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';

export class GetAirportById {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(id: string): Promise<Airport | null> {
    return this.airportsRepository.findById(id);
  }
} 