import { Request, Response } from 'express';
import { ListItineraries } from '../useCases/itinerary/ListItineraries';
import { CreateItinerary } from '../useCases/itinerary/CreateItinerary';
import { GetItineraryById } from '../useCases/itinerary/GetItineraryById';
import { DeleteItinerary } from '../useCases/itinerary/DeleteItinerary';

/**
 * @openapi
 * /itineraries:
 *   get:
 *     summary: Lista itinerários
 *     tags:
 *       - Itinerary
 *     responses:
 *       200:
 *         description: Lista de itinerários
 */
export class ItineraryController {
  constructor(
    private listItineraries: ListItineraries,
    private createItinerary: CreateItinerary,
    private getItineraryById: GetItineraryById,
    private deleteItinerary: DeleteItinerary
  ) {}

  async list(req: Request, res: Response) {
    const itineraries = await this.listItineraries.execute({});
    return res.json(itineraries);
  }

  /**
   * @openapi
   * /itineraries:
   *   post:
   *     summary: Cria um novo itinerário
   *     tags:
   *       - Itinerary
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               flight_ids:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       201:
   *         description: Itinerário criado com sucesso
   */
  async create(req: Request, res: Response) {
    const { flight_ids } = req.body;
    const itinerary = await this.createItinerary.execute({ flight_ids });
    return res.status(201).json(itinerary);
  }

  /**
   * @openapi
   * /itineraries/{id}:
   *   get:
   *     summary: Busca itinerário por ID
   *     tags:
   *       - Itinerary
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Itinerário encontrado
   */
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const itinerary = await this.getItineraryById.execute({ id });
    return res.json(itinerary);
  }

  /**
   * @openapi
   * /itineraries/{id}:
   *   delete:
   *     summary: Remove um itinerário
   *     tags:
   *       - Itinerary
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Itinerário removido com sucesso
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteItinerary.execute({ id });
    return res.status(204).send();
  }
} 