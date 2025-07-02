import { CreateFlight } from '../../../useCases/flight/CreateFlight';
import { IFlightsRepository } from '../../../interfaces/repositories/IFlightsRepository';
import { Flight } from '../../../entities/Flight';
import { AppError } from '../../../errors/AppError';

describe('CreateFlight UseCase', () => {
  let flightsRepository: jest.Mocked<IFlightsRepository>;
  let createFlight: CreateFlight;

  beforeEach(() => {
    flightsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createFlight = new CreateFlight(flightsRepository);
  });

  it('deve criar um voo com sucesso', async () => {
    const fakeFlight = new Flight('flight-uuid', 'LA123', 'airline-uuid', 'GRU', 'JFK', new Date(), new Date(), [1,2,3]);
    flightsRepository.create.mockResolvedValue(fakeFlight);
    const result = await createFlight.execute({
      flight_number: 'LA123',
      airline_id: 'airline-uuid',
      origin_iata: 'GRU',
      destination_iata: 'JFK',
      departure_datetime: new Date(),
      arrival_datetime: new Date(),
      frequency: [1,2,3],
    });
    expect(result).toHaveProperty('id', 'flight-uuid');
    expect(result.flight_number).toBe('LA123');
    expect(flightsRepository.create).toHaveBeenCalledWith(expect.any(Flight));
  });

  it('deve lançar erro se o número do voo for vazio', async () => {
    await expect(
      createFlight.execute({
        flight_number: '',
        airline_id: 'airline-uuid',
        origin_iata: 'GRU',
        destination_iata: 'JFK',
        departure_datetime: new Date(),
        arrival_datetime: new Date(),
        frequency: [1,2,3],
      })
    ).rejects.toThrow(AppError);
  });
}); 