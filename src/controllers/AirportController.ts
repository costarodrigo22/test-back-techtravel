import { Request, Response } from 'express';
import { CreateAirport } from '../useCases/airport/CreateAirport';
import { GetAirportById } from '../useCases/airport/GetAirportById';
import { UpdateAirport } from '../useCases/airport/UpdateAirport';
import { DeleteAirport } from '../useCases/airport/DeleteAirport';
import { ListAirports } from '../useCases/airport/ListAirports';

export class AirportController {
  constructor(
    private createAirport: CreateAirport,
    private getAirportById: GetAirportById,
    private updateAirport: UpdateAirport,
    private deleteAirport: DeleteAirport,
    private listAirports: ListAirports
  ) {}

  async list(req: Request, res: Response) {
    try {
      const airports = await this.listAirports.execute();
      return res.json(airports);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar aeroportos.' });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const airport = await this.getAirportById.execute(id);
      if (!airport) return res.status(404).json({ error: 'Aeroporto não encontrado.' });
      return res.json(airport);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar aeroporto.' });
    }
  }

  async create(req: Request, res: Response) {
    const { name, iata_code } = req.body;
    if (!name || !iata_code) {
      return res.status(400).json({ error: 'Nome e código IATA são obrigatórios.' });
    }
    try {
      const created = await this.createAirport.execute({ name, iata_code });
      return res.status(201).json(created);
    } catch (error: any) {
      if (
        error.code === 'P2002' &&
        ((Array.isArray(error.meta?.target) && error.meta.target.includes('iata_code')) ||
         error.meta?.target === 'iata_code')
      ) {
        return res.status(409).json({ error: 'Já existe um aeroporto com esse código IATA.' });
      }
      return res.status(500).json({ error: 'Erro ao criar aeroporto.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await this.updateAirport.execute(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Aeroporto não encontrado.' });
      return res.json(updated);
    } catch (error: any) {
      if (
        error.code === 'P2002' &&
        ((Array.isArray(error.meta?.target) && error.meta.target.includes('iata_code')) ||
         error.meta?.target === 'iata_code')
      ) {
        return res.status(409).json({ error: 'Já existe um aeroporto com esse código IATA.' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar aeroporto.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteAirport.execute(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover aeroporto.' });
    }
  }
} 