import { CreateItinerary } from '../../../useCases/itinerary/CreateItinerary';
import { IItinerariesRepository } from '../../../interfaces/repositories/IItinerariesRepository';
import { IFlightsRepository } from '../../../interfaces/repositories/IFlightsRepository';
import { Itinerary, ItineraryFlight } from '../../../entities/Itinerary';
import { AppError } from '../../../errors/AppError';

describe('CreateItinerary UseCase', () => {
  let itinerariesRepository: jest.Mocked<IItinerariesRepository>;
  let flightsRepository: jest.Mocked<IFlightsRepository>;
  let createItinerary: CreateItinerary;

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
    flightsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createItinerary = new CreateItinerary(itinerariesRepository, flightsRepository);
    flightsRepository.findAll.mockResolvedValue(fakeFlights as any);
  });

  it('deve criar um itinerário com sucesso', async () => {
    const fakeItinerary = new Itinerary(
      'itinerary-uuid',
      'GRU',
      'MIA',
      fakeFlights[0].departure_datetime,
      fakeFlights[1].arrival_datetime,
      480,
      1,
      fakeFlights
    );
    itinerariesRepository.create.mockResolvedValue(fakeItinerary);
    const result = await createItinerary.execute({ flight_ids: ['flight-1', 'flight-2'] });
    expect(result).toHaveProperty('id', 'itinerary-uuid');
    expect(result.flights).toEqual(fakeFlights);
    expect(itinerariesRepository.create).toHaveBeenCalledWith(['flight-1', 'flight-2']);
  });

  it('deve lançar erro se flight_ids for vazio', async () => {
    await expect(
      createItinerary.execute({ flight_ids: [] })
    ).rejects.toThrow(AppError);
  });
}); 