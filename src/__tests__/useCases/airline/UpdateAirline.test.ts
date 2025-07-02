import { UpdateAirline } from '../../../useCases/airline/UpdateAirline';
import { IAirlinesRepository } from '../../../interfaces/repositories/IAirlinesRepository';
import { Airline } from '../../../entities/Airline';
import { NotFoundError } from '../../../errors/NotFoundError';

describe('UpdateAirline UseCase', () => {
  let airlinesRepository: jest.Mocked<IAirlinesRepository>;
  let updateAirline: UpdateAirline;

  beforeEach(() => {
    airlinesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    updateAirline = new UpdateAirline(airlinesRepository);
  });

  it('deve atualizar uma companhia aérea existente', async () => {
    const fakeAirline = new Airline('airline-uuid', 'LATAM', 'LA');
    airlinesRepository.findById.mockResolvedValue(fakeAirline);
    airlinesRepository.update.mockResolvedValue({ ...fakeAirline, name: 'LATAM Linhas Aéreas' });
    const result = await updateAirline.execute({ id: 'airline-uuid', data: { name: 'LATAM Linhas Aéreas' } });
    expect(result).toEqual({ ...fakeAirline, name: 'LATAM Linhas Aéreas' });
    expect(airlinesRepository.update).toHaveBeenCalledWith('airline-uuid', { name: 'LATAM Linhas Aéreas' });
  });

  it('deve lançar erro se a companhia não existir', async () => {
    airlinesRepository.findById.mockResolvedValue(null);
    await expect(updateAirline.execute({ id: 'inexistente', data: { name: 'Nova' } })).rejects.toThrow(NotFoundError);
  });
}); 