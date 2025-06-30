import { Request, Response } from 'express';
import { IAirlinesRepository } from '../interfaces/repositories/IAirlinesRepository';
import { Airline } from '../entities/Airline';
import { randomUUID } from 'crypto';

export class AirlineController {
  constructor(private airlinesRepository: IAirlinesRepository) {}

  async list(req: Request, res: Response) {
    const airlines = await this.airlinesRepository.findAll();
    return res.json(airlines);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const airline = await this.airlinesRepository.findById(id);
    if (!airline) return res.status(404).json({ error: 'Companhia aérea não encontrada' });
    return res.json(airline);
  }

  async create(req: Request, res: Response) {
    const { name, iata_code } = req.body;
    const airline = new Airline(randomUUID(), name, iata_code);
    const created = await this.airlinesRepository.create(airline);
    return res.status(201).json(created);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.airlinesRepository.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Companhia aérea não encontrada' });
    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.airlinesRepository.delete(id);
    return res.status(204).send();
  }
} 