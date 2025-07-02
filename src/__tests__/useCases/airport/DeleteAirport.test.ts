import { DeleteAirport } from '../../../useCases/airport/DeleteAirport';
import { IAirportsRepository } from '../../../interfaces/repositories/IAirportsRepository';
import { NotFoundError } from '../../../errors/NotFoundError';
import { Airport } from '../../../entities/Airport';

describe('DeleteAirport UseCase', () => {
  let airportsRepository: jest.Mocked<IAirportsRepository>;
  let deleteAirport: DeleteAirport;

  beforeEach(() => {
    airportsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    deleteAirport = new DeleteAirport(airportsRepository);
  });

  it('deve deletar um aeroporto existente', async () => {
    const fakeAirport = new Airport('airport-uuid', 'Guarulhos', 'GRU');
    airportsRepository.findById.mockResolvedValue(fakeAirport);
    airportsRepository.delete.mockResolvedValue();
    await expect(deleteAirport.execute({ id: 'airport-uuid' })).resolves.toBeUndefined();
    expect(airportsRepository.delete).toHaveBeenCalledWith('airport-uuid');
  });

  it('deve lançar erro se o aeroporto não existir', async () => {
    airportsRepository.findById.mockResolvedValue(null);
    await expect(deleteAirport.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundError);
  });
}); 