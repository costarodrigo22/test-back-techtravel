import { Request, Response } from 'express';
import { CreateBooking } from '../useCases/booking/CreateBooking';
import { GetUserBookings } from '../useCases/booking/GetUserBookings';
import { CancelBooking } from '../useCases/booking/CancelBooking';

export class BookingController {
  constructor(
    private createBooking: CreateBooking,
    private getUserBookings: GetUserBookings,
    private cancelBooking: CancelBooking
  ) {}

  async create(req: Request, res: Response) {
    try {
      const { user_id, itinerary_id } = req.body;

      if (!user_id || !itinerary_id) {
        return res.status(400).json({ error: 'user_id e itinerary_id são obrigatórios.' });
      }

      const booking = await this.createBooking.execute({ user_id, itinerary_id });
      return res.status(201).json(booking);
    } catch (error: any) {
      if (error.status && error.message) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao criar reserva.' });
    }
  }

  async listUserBookings(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const bookings = await this.getUserBookings.execute({ userId });
      return res.json(bookings);
    } catch (error: any) {
      if (error.status && error.message) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao buscar reservas do usuário.' });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID da reserva é obrigatório.' });
      }

      const booking = await this.cancelBooking.execute({ id });
      return res.json(booking);
    } catch (error: any) {
      if (error.status && error.message) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao cancelar reserva.' });
    }
  }
} 