import { UpdateFlight } from '../../../useCases/flight/UpdateFlight';
import { IFlightsRepository } from '../../../interfaces/repositories/IFlightsRepository';
import { Flight } from '../../../entities/Flight';
import { NotFoundError } from '../../../errors/NotFoundError';

describe('UpdateFlight UseCase', () => {
  let flightsRepository: jest.Mocked<IFlightsRepository>;
  let updateFlight: UpdateFlight;

  beforeEach(() => {
    flightsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    updateFlight = new UpdateFlight(flightsRepository);
  });

  it('deve atualizar um voo existente', async () => {
    const fakeFlight = new Flight('flight-uuid', 'LA123', 'airline-uuid', 'GRU', 'JFK', new Date(), new Date(), [1,2,3]);
    flightsRepository.findById.mockResolvedValue(fakeFlight);
    flightsRepository.update.mockResolvedValue({ ...fakeFlight, flight_number: 'LA124' });
    const result = await updateFlight.execute({ id: 'flight-uuid', data: { flight_number: 'LA124' } });
    expect(result).toEqual({ ...fakeFlight, flight_number: 'LA124' });
    expect(flightsRepository.update).toHaveBeenCalledWith('flight-uuid', { flight_number: 'LA124' });
  });

  it('deve lançar erro se o voo não existir', async () => {
    flightsRepository.findById.mockResolvedValue(null);
    await expect(updateFlight.execute({ id: 'inexistente', data: { flight_number: 'LA124' } })).rejects.toThrow(NotFoundError);
  });
}); 