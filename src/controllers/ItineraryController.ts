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
    const itineraries = await this.listItineraries.execute({});
    return res.json(itineraries);
  }

  async create(req: Request, res: Response) {
    const { flight_ids } = req.body;
    const itinerary = await this.createItinerary.execute({ flight_ids });
    return res.status(201).json(itinerary);
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const itinerary = await this.getItineraryById.execute({ id });
    return res.json(itinerary);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteItinerary.execute({ id });
    return res.status(204).send();
  }
} 