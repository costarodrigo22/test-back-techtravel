import { SearchAvailability } from '../../../useCases/availability/SearchAvailability';
import { IItinerariesRepository } from '../../../interfaces/repositories/IItinerariesRepository';
import { Itinerary, ItineraryFlight } from '../../../entities/Itinerary';
import { AppError } from '../../../errors/AppError';

describe('SearchAvailability UseCase', () => {
  let itinerariesRepository: jest.Mocked<IItinerariesRepository>;
  let searchAvailability: SearchAvailability;

  const fakeFlights: ItineraryFlight[] = [
    {
      id: 'flight-1',
      flight_number: 'LA123',
      origin_iata: 'GRU',
      destination_iata: 'JFK',
      departure_datetime: new Date('2024-07-01T10:00:00Z'),
      arrival_datetime: new Date('2024-07-01T14:00:00Z'),
      airline_iata_code: 'LA',
    },
    {
      id: 'flight-2',
      flight_number: 'LA456',
      origin_iata: 'JFK',
      destination_iata: 'MIA',
      departure_datetime: new Date('2024-07-01T16:00:00Z'),
      arrival_datetime: new Date('2024-07-01T18:00:00Z'),
      airline_iata_code: 'LA',
    },
  ];

  const fakeItineraries: Itinerary[] = [
    new Itinerary('itinerary-uuid', 'GRU', 'MIA', fakeFlights[0].departure_datetime, fakeFlights[1].arrival_datetime, 480, 1, fakeFlights),
  ];

  beforeEach(() => {
    itinerariesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    searchAvailability = new SearchAvailability(itinerariesRepository);
  });

  it('deve retornar itinerários disponíveis', async () => {
    itinerariesRepository.findAll.mockResolvedValue(fakeItineraries);
    const result = await searchAvailability.execute({
      origin: 'GRU',
      destination: 'MIA',
      departure_date: '2024-07-01',
      return_date: '2024-07-10',
    });
    expect(result).toHaveProperty('outbound_itineraries');
    expect(Array.isArray(result.outbound_itineraries)).toBe(true);
  });

  it('deve lançar erro se origem ou destino for vazio', async () => {
    await expect(
      searchAvailability.execute({
        origin: '',
        destination: 'MIA',
        departure_date: '2024-07-01',
        return_date: '2024-07-10',
      })
    ).rejects.toThrow(AppError);
    await expect(
      searchAvailability.execute({
        origin: 'GRU',
        destination: '',
        departure_date: '2024-07-01',
        return_date: '2024-07-10',
      })
    ).rejects.toThrow(AppError);
  });
}); 