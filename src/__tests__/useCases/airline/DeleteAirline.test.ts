import { DeleteAirline } from '../../../useCases/airline/DeleteAirline';
import { IAirlinesRepository } from '../../../interfaces/repositories/IAirlinesRepository';
import { NotFoundError } from '../../../errors/NotFoundError';
import { Airline } from '../../../entities/Airline';

describe('DeleteAirline UseCase', () => {
  let airlinesRepository: jest.Mocked<IAirlinesRepository>;
  let deleteAirline: DeleteAirline;

  beforeEach(() => {
    airlinesRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    deleteAirline = new DeleteAirline(airlinesRepository);
  });

  it('deve deletar uma companhia aérea existente', async () => {
    const fakeAirline = new Airline('airline-uuid', 'LATAM', 'LA');
    airlinesRepository.findById.mockResolvedValue(fakeAirline);
    airlinesRepository.delete.mockResolvedValue();
    await expect(deleteAirline.execute({ id: 'airline-uuid' })).resolves.toBeUndefined();
    expect(airlinesRepository.delete).toHaveBeenCalledWith('airline-uuid');
  });

  it('deve lançar erro se a companhia não existir', async () => {
    airlinesRepository.findById.mockResolvedValue(null);
    await expect(deleteAirline.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundError);
  });
}); 