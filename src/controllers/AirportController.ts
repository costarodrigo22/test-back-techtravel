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
    const airports = await this.listAirports.execute({});
    return res.json(airports);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const airport = await this.getAirportById.execute({ id });
    return res.json(airport);
  }

  async create(req: Request, res: Response) {
    const { name, iata_code } = req.body;
    const created = await this.createAirport.execute({ name, iata_code });
    return res.status(201).json(created);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.updateAirport.execute({ id, data: req.body });
    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteAirport.execute({ id });
    return res.status(204).send();
  }
} 