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
    const { airline_code, origin, destination } = req.query;
    const flights = await this.listFlights.execute({
      filters: {
        airline_code: airline_code as string,
        origin: origin as string,
        destination: destination as string,
      }
    });
    return res.json(flights);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const flight = await this.getFlightById.execute({ id });
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
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.updateFlight.execute({ id, data: req.body });
    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteFlight.execute({ id });
    return res.status(204).send();
  }
} 