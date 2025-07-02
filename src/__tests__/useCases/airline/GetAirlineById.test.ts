import { GetAirlineById } from '../../../useCases/airline/GetAirlineById';
import { IAirlinesRepository } from '../../../interfaces/repositories/IAirlinesRepository';
import { Airline } from '../../../entities/Airline';
import { NotFoundError } from '../../../errors/NotFoundError';

describe('GetAirlineById UseCase', () => {
  let airlinesRepository: jest.Mocked<IAirlinesRepository>;
  let getAirlineById: GetAirlineById;

  beforeEach(() => {
    airlinesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    getAirlineById = new GetAirlineById(airlinesRepository);
  });

  it('deve retornar a companhia aérea pelo ID', async () => {
    const fakeAirline = new Airline('airline-uuid', 'LATAM', 'LA');
    airlinesRepository.findById.mockResolvedValue(fakeAirline);
    const result = await getAirlineById.execute({ id: 'airline-uuid' });
    expect(result).toBe(fakeAirline);
  });

  it('deve lançar erro se a companhia não existir', async () => {
    airlinesRepository.findById.mockResolvedValue(null);
    await expect(getAirlineById.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundError);
  });
}); 