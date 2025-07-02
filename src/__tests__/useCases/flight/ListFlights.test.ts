import { ListFlights } from '../../../useCases/flight/ListFlights';
import { IFlightsRepository } from '../../../interfaces/repositories/IFlightsRepository';
import { Flight } from '../../../entities/Flight';

describe('ListFlights UseCase', () => {
  let flightsRepository: jest.Mocked<IFlightsRepository>;
  let listFlights: ListFlights;

  beforeEach(() => {
    flightsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    listFlights = new ListFlights(flightsRepository);
  });

  it('deve retornar todos os voos', async () => {
    const fakeFlights = [
      new Flight('1', 'LA123', 'airline-uuid', 'GRU', 'JFK', new Date(), new Date(), [1,2,3]),
      new Flight('2', 'G3123', 'airline-uuid', 'CGH', 'SDU', new Date(), new Date(), [4,5,6]),
    ];
    flightsRepository.findAll.mockResolvedValue(fakeFlights);
    const result = await listFlights.execute({ filters: {} });
    expect(result).toEqual(fakeFlights);
  });

  it('deve retornar array vazio se não houver voos', async () => {
    flightsRepository.findAll.mockResolvedValue([]);
    const result = await listFlights.execute({ filters: {} });
    expect(result).toEqual([]);
  });
}); 