import { CreateAirline } from '../../../useCases/airline/CreateAirline';
import { IAirlinesRepository } from '../../../interfaces/repositories/IAirlinesRepository';
import { Airline } from '../../../entities/Airline';
import { AppError } from '../../../errors/AppError';

describe('CreateAirline UseCase', () => {
  let airlinesRepository: jest.Mocked<IAirlinesRepository>;
  let createAirline: CreateAirline;

  beforeEach(() => {
    airlinesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createAirline = new CreateAirline(airlinesRepository);
  });

  it('deve criar uma companhia aérea com sucesso', async () => {
    const fakeAirline = new Airline('airline-uuid', 'LATAM', 'LA');
    airlinesRepository.create.mockResolvedValue(fakeAirline);

    const result = await createAirline.execute({ name: 'LATAM', iata_code: 'LA' });

    expect(result).toHaveProperty('id', 'airline-uuid');
    expect(result.name).toBe('LATAM');
    expect(result.iata_code).toBe('LA');
    expect(airlinesRepository.create).toHaveBeenCalledWith(expect.any(Airline));
  });

  it('deve lançar erro se o nome for vazio', async () => {
    await expect(
      createAirline.execute({ name: '', iata_code: 'LA' })
    ).rejects.toThrow(AppError);
  });

  it('deve lançar erro se o código IATA for inválido', async () => {
    await expect(
      createAirline.execute({ name: 'LATAM', iata_code: 'L' })
    ).rejects.toThrow(AppError);
  });
}); 