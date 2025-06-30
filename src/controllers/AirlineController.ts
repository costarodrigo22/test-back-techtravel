import { Request, Response } from 'express';
import { CreateAirline } from '../useCases/airline/CreateAirline';
import { GetAirlineById } from '../useCases/airline/GetAirlineById';
import { UpdateAirline } from '../useCases/airline/UpdateAirline';
import { DeleteAirline } from '../useCases/airline/DeleteAirline';
import { ListAirlines } from '../useCases/airline/ListAirlines';

export class AirlineController {
  constructor(
    private createAirline: CreateAirline,
    private getAirlineById: GetAirlineById,
    private updateAirline: UpdateAirline,
    private deleteAirline: DeleteAirline,
    private listAirlines: ListAirlines
  ) {}

  async list(req: Request, res: Response) {
    try {
      const airlines = await this.listAirlines.execute();
      return res.json(airlines);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar companhias aéreas.' });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const airline = await this.getAirlineById.execute(id);
      if (!airline) return res.status(404).json({ error: 'Companhia aérea não encontrada.' });
      return res.json(airline);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar companhia aérea.' });
    }
  }

  async create(req: Request, res: Response) {
    const { name, iata_code } = req.body;
    if (!name || !iata_code) {
      return res.status(400).json({ error: 'Nome e código IATA são obrigatórios.' });
    }
    try {
      const created = await this.createAirline.execute({ name, iata_code });
      return res.status(201).json(created);
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('iata_code')) {
        return res.status(409).json({ error: 'Já existe uma companhia aérea com esse código IATA.' });
      }
      return res.status(500).json({ error: 'Erro ao criar companhia aérea.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await this.updateAirline.execute(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Companhia aérea não encontrada.' });
      return res.json(updated);
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('iata_code')) {
        return res.status(409).json({ error: 'Já existe uma companhia aérea com esse código IATA.' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar companhia aérea.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteAirline.execute(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover companhia aérea.' });
    }
  }
} 