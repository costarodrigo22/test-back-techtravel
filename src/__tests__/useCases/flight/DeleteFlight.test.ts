import { DeleteFlight } from '../../../useCases/flight/DeleteFlight';
import { IFlightsRepository } from '../../../interfaces/repositories/IFlightsRepository';
import { NotFoundError } from '../../../errors/NotFoundError';
import { Flight } from '../../../entities/Flight';

describe('DeleteFlight UseCase', () => {
  let flightsRepository: jest.Mocked<IFlightsRepository>;
  let deleteFlight: DeleteFlight;

  beforeEach(() => {
    flightsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    deleteFlight = new DeleteFlight(flightsRepository);
  });

  it('deve deletar um voo existente', async () => {
    const fakeFlight = new Flight('flight-uuid', 'LA123', 'airline-uuid', 'GRU', 'JFK', new Date(), new Date(), [1,2,3]);
    flightsRepository.findById.mockResolvedValue(fakeFlight);
    flightsRepository.delete.mockResolvedValue();
    await expect(deleteFlight.execute({ id: 'flight-uuid' })).resolves.toBeUndefined();
    expect(flightsRepository.delete).toHaveBeenCalledWith('flight-uuid');
  });

  it('deve lançar erro se o voo não existir', async () => {
    flightsRepository.findById.mockResolvedValue(null);
    await expect(deleteFlight.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundError);
  });
}); 