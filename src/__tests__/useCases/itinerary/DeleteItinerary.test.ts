import { DeleteItinerary } from '../../../useCases/itinerary/DeleteItinerary';
import { IItinerariesRepository } from '../../../interfaces/repositories/IItinerariesRepository';
import { NotFoundError } from '../../../errors/NotFoundError';
import { Itinerary, ItineraryFlight } from '../../../entities/Itinerary';

describe('DeleteItinerary UseCase', () => {
  let itinerariesRepository: jest.Mocked<IItinerariesRepository>;
  let deleteItinerary: DeleteItinerary;

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
    deleteItinerary = new DeleteItinerary(itinerariesRepository);
  });

  it('deve deletar um itinerário existente', async () => {
    const fakeItinerary = new Itinerary('itinerary-uuid', 'GRU', 'MIA', fakeFlights[0].departure_datetime, fakeFlights[1].arrival_datetime, 480, 1, fakeFlights);
    itinerariesRepository.findById.mockResolvedValue(fakeItinerary);
    itinerariesRepository.delete.mockResolvedValue();
    await expect(deleteItinerary.execute({ id: 'itinerary-uuid' })).resolves.toBeUndefined();
    expect(itinerariesRepository.delete).toHaveBeenCalledWith('itinerary-uuid');
  });

  it('deve lançar erro se o itinerário não existir', async () => {
    itinerariesRepository.findById.mockResolvedValue(null);
    await expect(deleteItinerary.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundError);
  });
}); 