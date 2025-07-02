import { GetAirportById } from '../../../useCases/airport/GetAirportById';
import { IAirportsRepository } from '../../../interfaces/repositories/IAirportsRepository';
import { Airport } from '../../../entities/Airport';
import { NotFoundError } from '../../../errors/NotFoundError';

describe('GetAirportById UseCase', () => {
  let airportsRepository: jest.Mocked<IAirportsRepository>;
  let getAirportById: GetAirportById;

  beforeEach(() => {
    airportsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    getAirportById = new GetAirportById(airportsRepository);
  });

  it('deve retornar o aeroporto pelo ID', async () => {
    const fakeAirport = new Airport('airport-uuid', 'Guarulhos', 'GRU');
    airportsRepository.findById.mockResolvedValue(fakeAirport);
    const result = await getAirportById.execute({ id: 'airport-uuid' });
    expect(result).toBe(fakeAirport);
  });

  it('deve lançar erro se o aeroporto não existir', async () => {
    airportsRepository.findById.mockResolvedValue(null);
    await expect(getAirportById.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundError);
  });
}); 