import { ListAirlines } from '../../../useCases/airline/ListAirlines';
import { IAirlinesRepository } from '../../../interfaces/repositories/IAirlinesRepository';
import { Airline } from '../../../entities/Airline';

describe('ListAirlines UseCase', () => {
  let airlinesRepository: jest.Mocked<IAirlinesRepository>;
  let listAirlines: ListAirlines;

  beforeEach(() => {
    airlinesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    listAirlines = new ListAirlines(airlinesRepository);
  });

  it('deve retornar todas as companhias aéreas', async () => {
    const fakeAirlines = [
      new Airline('1', 'LATAM', 'LA'),
      new Airline('2', 'GOL', 'G3'),
    ];
    airlinesRepository.findAll.mockResolvedValue(fakeAirlines);
    const result = await listAirlines.execute();
    expect(result).toEqual(fakeAirlines);
  });

  it('deve retornar array vazio se não houver companhias', async () => {
    airlinesRepository.findAll.mockResolvedValue([]);
    const result = await listAirlines.execute();
    expect(result).toEqual([]);
  });
}); 