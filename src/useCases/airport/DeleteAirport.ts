import { IAirportsRepository } from '../../interfaces/repositories/IAirportsRepository';

export class DeleteAirport {
  constructor(private airportsRepository: IAirportsRepository) {}

  async execute(id: string): Promise<void> {
    await this.airportsRepository.delete(id);
  }
} 