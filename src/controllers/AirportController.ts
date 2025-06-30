import { Request, Response } from 'express';
import { IAirportsRepository } from '../interfaces/repositories/IAirportsRepository';
import { Airport } from '../entities/Airport';
import { randomUUID } from 'crypto';

export class AirportController {
  constructor(private airportsRepository: IAirportsRepository) {}

  async list(req: Request, res: Response) {
    const airports = await this.airportsRepository.findAll();
    return res.json(airports);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const airport = await this.airportsRepository.findById(id);
    if (!airport) return res.status(404).json({ error: 'Aeroporto não encontrado' });
    return res.json(airport);
  }

  async create(req: Request, res: Response) {
    const { name, iata_code } = req.body;
    const airport = new Airport(randomUUID(), name, iata_code);
    const created = await this.airportsRepository.create(airport);
    return res.status(201).json(created);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.airportsRepository.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Aeroporto não encontrado' });
    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.airportsRepository.delete(id);
    return res.status(204).send();
  }
} 