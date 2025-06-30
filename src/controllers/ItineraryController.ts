import { Request, Response } from 'express';
import { ListItineraries } from '../useCases/itinerary/ListItineraries';
import { CreateItinerary } from '../useCases/itinerary/CreateItinerary';
import { GetItineraryById } from '../useCases/itinerary/GetItineraryById';
import { DeleteItinerary } from '../useCases/itinerary/DeleteItinerary';

export class ItineraryController {
  constructor(
    private listItineraries: ListItineraries,
    private createItinerary: CreateItinerary,
    private getItineraryById: GetItineraryById,
    private deleteItinerary: DeleteItinerary
  ) {}

  async list(req: Request, res: Response) {
    try {
      const itineraries = await this.listItineraries.execute();
      return res.json(itineraries);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar itinerários.' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { flight_ids } = req.body;
      const itinerary = await this.createItinerary.execute({ flight_ids });
      return res.status(201).json(itinerary);
    } catch (error: any) {
      if (error.status && error.message) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao criar itinerário.' });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const itinerary = await this.getItineraryById.execute(id);
      if (!itinerary) return res.status(404).json({ error: 'Itinerário não encontrado.' });
      return res.json(itinerary);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar itinerário.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteItinerary.execute(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover itinerário.' });
    }
  }
} 