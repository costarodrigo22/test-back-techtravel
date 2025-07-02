import { UpdateAirport } from '../../../useCases/airport/UpdateAirport';
import { IAirportsRepository } from '../../../interfaces/repositories/IAirportsRepository';
import { Airport } from '../../../entities/Airport';
import { NotFoundError } from '../../../errors/NotFoundError';

describe('UpdateAirport UseCase', () => {
  let airportsRepository: jest.Mocked<IAirportsRepository>;
  let updateAirport: UpdateAirport;

  beforeEach(() => {
    airportsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    updateAirport = new UpdateAirport(airportsRepository);
  });

  it('deve atualizar um aeroporto existente', async () => {
    const fakeAirport = new Airport('airport-uuid', 'Guarulhos', 'GRU');
    airportsRepository.findById.mockResolvedValue(fakeAirport);
    airportsRepository.update.mockResolvedValue({ ...fakeAirport, name: 'Aeroporto Internacional de Guarulhos' });
    const result = await updateAirport.execute({ id: 'airport-uuid', data: { name: 'Aeroporto Internacional de Guarulhos' } });
    expect(result).toEqual({ ...fakeAirport, name: 'Aeroporto Internacional de Guarulhos' });
    expect(airportsRepository.update).toHaveBeenCalledWith('airport-uuid', { name: 'Aeroporto Internacional de Guarulhos' });
  });

  it('deve lançar erro se o aeroporto não existir', async () => {
    airportsRepository.findById.mockResolvedValue(null);
    await expect(updateAirport.execute({ id: 'inexistente', data: { name: 'Novo' } })).rejects.toThrow(NotFoundError);
  });
}); 