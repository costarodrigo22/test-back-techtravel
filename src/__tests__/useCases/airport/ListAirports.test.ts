import { ListAirports } from '../../../useCases/airport/ListAirports';
import { IAirportsRepository } from '../../../interfaces/repositories/IAirportsRepository';
import { Airport } from '../../../entities/Airport';

describe('ListAirports UseCase', () => {
  let airportsRepository: jest.Mocked<IAirportsRepository>;
  let listAirports: ListAirports;

  beforeEach(() => {
    airportsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    listAirports = new ListAirports(airportsRepository);
  });

  it('deve retornar todos os aeroportos', async () => {
    const fakeAirports = [
      new Airport('1', 'Guarulhos', 'GRU'),
      new Airport('2', 'Congonhas', 'CGH'),
    ];
    airportsRepository.findAll.mockResolvedValue(fakeAirports);
    const result = await listAirports.execute();
    expect(result).toEqual(fakeAirports);
  });

  it('deve retornar array vazio se não houver aeroportos', async () => {
    airportsRepository.findAll.mockResolvedValue([]);
    const result = await listAirports.execute();
    expect(result).toEqual([]);
  });
}); 