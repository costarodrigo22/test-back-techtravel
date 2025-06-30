import { Request, Response } from 'express';
import { IFlightsRepository } from '../interfaces/repositories/IFlightsRepository';
import { Flight } from '../entities/Flight';
import { randomUUID } from 'crypto';

export class FlightController {
  constructor(private flightsRepository: IFlightsRepository) {}

  async list(req: Request, res: Response) {
    const { airline_code, origin, destination } = req.query;
    const flights = await this.flightsRepository.findAll({
      airline_code: airline_code as string,
      origin: origin as string,
      destination: destination as string,
    });
    return res.json(flights);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const flight = await this.flightsRepository.findById(id);
    if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
    return res.json(flight);
  }

  async create(req: Request, res: Response) {
    const {
      flight_number,
      airline_id,
      origin_iata,
      destination_iata,
      departure_datetime,
      arrival_datetime,
      frequency,
    } = req.body;
    const flight = new Flight(
      randomUUID(),
      flight_number,
      airline_id,
      origin_iata,
      destination_iata,
      new Date(departure_datetime),
      new Date(arrival_datetime),
      frequency
    );
    const created = await this.flightsRepository.create(flight);
    return res.status(201).json(created);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.flightsRepository.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Voo não encontrado' });
    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.flightsRepository.delete(id);
    return res.status(204).send();
  }
} 