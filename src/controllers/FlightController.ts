import { Request, Response } from 'express';
import { CreateFlight } from '../useCases/flight/CreateFlight';
import { GetFlightById } from '../useCases/flight/GetFlightById';
import { UpdateFlight } from '../useCases/flight/UpdateFlight';
import { DeleteFlight } from '../useCases/flight/DeleteFlight';
import { ListFlights } from '../useCases/flight/ListFlights';

/**
 * @openapi
 * /flights:
 *   get:
 *     summary: Lista voos
 *     tags:
 *       - Flight
 *     parameters:
 *       - in: query
 *         name: airline_code
 *         schema:
 *           type: string
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de voos
 */
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

  /**
   * @openapi
   * /flights/{id}:
   *   get:
   *     summary: Busca voo por ID
   *     tags:
   *       - Flight
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Voo encontrado
   */
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const flight = await this.getFlightById.execute({ id });
    return res.json(flight);
  }

  /**
   * @openapi
   * /flights:
   *   post:
   *     summary: Cria um novo voo
   *     tags:
   *       - Flight
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               flight_number:
   *                 type: string
   *               airline_id:
   *                 type: string
   *               origin_iata:
   *                 type: string
   *               destination_iata:
   *                 type: string
   *               departure_datetime:
   *                 type: string
   *                 format: date-time
   *               arrival_datetime:
   *                 type: string
   *                 format: date-time
   *               frequency:
   *                 type: string
   *     responses:
   *       201:
   *         description: Voo criado com sucesso
   */
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

  /**
   * @openapi
   * /flights/{id}:
   *   put:
   *     summary: Atualiza um voo
   *     tags:
   *       - Flight
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Voo atualizado com sucesso
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.updateFlight.execute({ id, data: req.body });
    return res.json(updated);
  }

  /**
   * @openapi
   * /flights/{id}:
   *   delete:
   *     summary: Remove um voo
   *     tags:
   *       - Flight
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Voo removido com sucesso
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteFlight.execute({ id });
    return res.status(204).send();
  }
} 