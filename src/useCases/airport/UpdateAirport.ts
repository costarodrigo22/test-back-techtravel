import { Airport } from '../../entities/Airport';
import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';

export class UpdateAirport {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(id: string, data: Partial<Airport>): Promise<Airport | null> {
    return this.airportsRepository.update(id, data);
  }
} 