import { Request, Response } from 'express';
import { CreateAirport } from '../useCases/airport/CreateAirport';
import { GetAirportById } from '../useCases/airport/GetAirportById';
import { UpdateAirport } from '../useCases/airport/UpdateAirport';
import { DeleteAirport } from '../useCases/airport/DeleteAirport';
import { ListAirports } from '../useCases/airport/ListAirports';

/**
 * @openapi
 * /airports:
 *   get:
 *     summary: Lista aeroportos
 *     tags:
 *       - Airport
 *     responses:
 *       200:
 *         description: Lista de aeroportos
 */
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

  /**
   * @openapi
   * /airports/{id}:
   *   get:
   *     summary: Busca aeroporto por ID
   *     tags:
   *       - Airport
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Aeroporto encontrado
   */
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const airport = await this.getAirportById.execute({ id });
    return res.json(airport);
  }

  /**
   * @openapi
   * /airports:
   *   post:
   *     summary: Cria um novo aeroporto
   *     tags:
   *       - Airport
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
   *         description: Aeroporto criado com sucesso
   */
  async create(req: Request, res: Response) {
    const { name, iata_code } = req.body;
    const created = await this.createAirport.execute({ name, iata_code });
    return res.status(201).json(created);
  }

  /**
   * @openapi
   * /airports/{id}:
   *   put:
   *     summary: Atualiza um aeroporto
   *     tags:
   *       - Airport
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
   *         description: Aeroporto atualizado com sucesso
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await this.updateAirport.execute({ id, data: req.body });
    return res.json(updated);
  }

  /**
   * @openapi
   * /airports/{id}:
   *   delete:
   *     summary: Remove um aeroporto
   *     tags:
   *       - Airport
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Aeroporto removido com sucesso
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteAirport.execute({ id });
    return res.status(204).send();
  }
} 