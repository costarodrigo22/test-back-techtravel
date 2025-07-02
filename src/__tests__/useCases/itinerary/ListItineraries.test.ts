import { ListItineraries } from '../../../useCases/itinerary/ListItineraries';
import { IItinerariesRepository } from '../../../interfaces/repositories/IItinerariesRepository';
import { Itinerary, ItineraryFlight } from '../../../entities/Itinerary';

describe('ListItineraries UseCase', () => {
  let itinerariesRepository: jest.Mocked<IItinerariesRepository>;
  let listItineraries: ListItineraries;

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

  beforeEach(() => {
    itinerariesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    listItineraries = new ListItineraries(itinerariesRepository);
  });

  it('deve retornar todos os itinerários', async () => {
    const fakeItineraries = [
      new Itinerary('1', 'GRU', 'MIA', fakeFlights[0].departure_datetime, fakeFlights[1].arrival_datetime, 480, 1, fakeFlights),
      new Itinerary('2', 'GRU', 'JFK', fakeFlights[0].departure_datetime, fakeFlights[0].arrival_datetime, 240, 0, [fakeFlights[0]]),
    ];
    itinerariesRepository.findAll.mockResolvedValue(fakeItineraries);
    const result = await listItineraries.execute();
    expect(result).toEqual(fakeItineraries);
  });

  it('deve retornar array vazio se não houver itinerários', async () => {
    itinerariesRepository.findAll.mockResolvedValue([]);
    const result = await listItineraries.execute();
    expect(result).toEqual([]);
  });
}); 