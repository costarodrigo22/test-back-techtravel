import { CreateAirport } from '../../../useCases/airport/CreateAirport';
import { IAirportsRepository } from '../../../interfaces/repositories/IAirportsRepository';
import { Airport } from '../../../entities/Airport';
import { AppError } from '../../../errors/AppError';

describe('CreateAirport UseCase', () => {
  let airportsRepository: jest.Mocked<IAirportsRepository>;
  let createAirport: CreateAirport;

  beforeEach(() => {
    airportsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createAirport = new CreateAirport(airportsRepository);
  });

  it('deve criar um aeroporto com sucesso', async () => {
    const fakeAirport = new Airport('airport-uuid', 'Guarulhos', 'GRU');
    airportsRepository.create.mockResolvedValue(fakeAirport);
    const result = await createAirport.execute({ name: 'Guarulhos', iata_code: 'GRU' });
    expect(result).toHaveProperty('id', 'airport-uuid');
    expect(result.name).toBe('Guarulhos');
    expect(result.iata_code).toBe('GRU');
    expect(airportsRepository.create).toHaveBeenCalledWith(expect.any(Airport));
  });

  it('deve lançar erro se o nome for vazio', async () => {
    await expect(
      createAirport.execute({ name: '', iata_code: 'GRU' })
    ).rejects.toThrow(AppError);
  });

  it('deve lançar erro se o código IATA for inválido', async () => {
    await expect(
      createAirport.execute({ name: 'Guarulhos', iata_code: 'G' })
    ).rejects.toThrow(AppError);
  });
}); 