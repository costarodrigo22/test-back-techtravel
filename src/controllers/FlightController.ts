import { Request, Response } from 'express';
import { CreateFlight } from '../useCases/flight/CreateFlight';
import { GetFlightById } from '../useCases/flight/GetFlightById';
import { UpdateFlight } from '../useCases/flight/UpdateFlight';
import { DeleteFlight } from '../useCases/flight/DeleteFlight';
import { ListFlights } from '../useCases/flight/ListFlights';

export class FlightController {
  constructor(
    private createFlight: CreateFlight,
    private getFlightById: GetFlightById,
    private updateFlight: UpdateFlight,
    private deleteFlight: DeleteFlight,
    private listFlights: ListFlights
  ) {}

  async list(req: Request, res: Response) {
    try {
      const { airline_code, origin, destination } = req.query;
      const flights = await this.listFlights.execute({
        airline_code: airline_code as string,
        origin: origin as string,
        destination: destination as string,
      });
      return res.json(flights);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar voos.' });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const flight = await this.getFlightById.execute(id);
      if (!flight) return res.status(404).json({ error: 'Voo não encontrado.' });
      return res.json(flight);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar voo.' });
    }
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
    if (!flight_number || !airline_id || !origin_iata || !destination_iata || !departure_datetime || !arrival_datetime || !frequency) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }
    try {
      const created = await this.createFlight.execute({
        flight_number,
        airline_id,
        origin_iata,
        destination_iata,
        departure_datetime: new Date(departure_datetime),
        arrival_datetime: new Date(arrival_datetime),
        frequency,
      });
      return res.status(201).json(created);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Já existe um voo com esses dados únicos.' });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Chave estrangeira inválida: verifique airline_id, origin_iata e destination_iata.' });
      }
      return res.status(500).json({ error: 'Erro ao criar voo.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await this.updateFlight.execute(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Voo não encontrado.' });
      return res.json(updated);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Já existe um voo com esses dados únicos.' });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Chave estrangeira inválida: verifique airline_id, origin_iata e destination_iata.' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar voo.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteFlight.execute(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover voo.' });
    }
  }
} 