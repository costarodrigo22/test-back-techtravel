import { GetFlightById } from '../../../useCases/flight/GetFlightById';
import { IFlightsRepository } from '../../../interfaces/repositories/IFlightsRepository';
import { Flight } from '../../../entities/Flight';
import { NotFoundError } from '../../../errors/NotFoundError';

describe('GetFlightById UseCase', () => {
  let flightsRepository: jest.Mocked<IFlightsRepository>;
  let getFlightById: GetFlightById;

  beforeEach(() => {
    flightsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    getFlightById = new GetFlightById(flightsRepository);
  });

  it('deve retornar o voo pelo ID', async () => {
    const fakeFlight = new Flight('flight-uuid', 'LA123', 'airline-uuid', 'GRU', 'JFK', new Date(), new Date(), [1,2,3]);
    flightsRepository.findById.mockResolvedValue(fakeFlight);
    const result = await getFlightById.execute({ id: 'flight-uuid' });
    expect(result).toBe(fakeFlight);
  });

  it('deve lançar erro se o voo não existir', async () => {
    flightsRepository.findById.mockResolvedValue(null);
    await expect(getFlightById.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundError);
  });
}); 