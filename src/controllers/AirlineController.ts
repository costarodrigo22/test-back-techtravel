import { Request, Response } from 'express';
import { CreateAirline } from '../useCases/airline/CreateAirline';
import { GetAirlineById } from '../useCases/airline/GetAirlineById';
import { UpdateAirline } from '../useCases/airline/UpdateAirline';
import { DeleteAirline } from '../useCases/airline/DeleteAirline';
import { ListAirlines } from '../useCases/airline/ListAirlines';

/**
 * @openapi
 * /airlines:
 *   get:
 *     summary: Lista companhias aéreas
 *     tags:
 *       - Airline
 *     responses:
 *       200:
 *         description: Lista de companhias aéreas
 */
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

  /**
   * @openapi
   * /airlines/{id}:
   *   get:
   *     summary: Busca companhia aérea por ID
   *     tags:
   *       - Airline
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Companhia aérea encontrada
   */
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const airline = await this.getAirlineById.execute({ id });
    return res.json(airline);
  }

  /**
   * @openapi
   * /airlines:
   *   post:
   *     summary: Cria uma nova companhia aérea
   *     tags:
   *       - Airline
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               iata_code:
   *                 type: string
   *     responses:
   *       201:
   *         description: Companhia aérea criada com sucesso
   */
  async create(req: Request, res: Response) {
    const { name, iata_code } = req.body;
    const created = await this.createAirline.execute({ name, iata_code });
    return res.status(201).json(created);
  }

  /**
   * @openapi
   * /airlines/{id}:
   *   put:
   *     summary: Atualiza uma companhia aérea
   *     tags:
   *       - Airline
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
   *         description: Companhia aérea atualizada com sucesso
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.updateAirline.execute({ id, data: req.body });
    return res.json(updated);
  }

  /**
   * @openapi
   * /airlines/{id}:
   *   delete:
   *     summary: Remove uma companhia aérea
   *     tags:
   *       - Airline
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Companhia aérea removida com sucesso
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteAirline.execute({ id });
    return res.status(204).send();
  }
} 