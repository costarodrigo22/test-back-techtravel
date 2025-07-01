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
    const airlines = await this.listAirlines.execute({});
    return res.json(airlines);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const airline = await this.getAirlineById.execute({ id });
    return res.json(airline);
  }

  async create(req: Request, res: Response) {
    const { name, iata_code } = req.body;
    const created = await this.createAirline.execute({ name, iata_code });
    return res.status(201).json(created);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.updateAirline.execute({ id, data: req.body });
    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteAirline.execute({ id });
    return res.status(204).send();
  }
} 