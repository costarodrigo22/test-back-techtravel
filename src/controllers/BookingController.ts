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
    const { user_id, itinerary_id } = req.body;

    const booking = await this.createBooking.execute({ userId: user_id, itineraryId: itinerary_id });
    return res.status(201).json(booking);
  }

  async listUserBookings(req: Request, res: Response) {
    const { userId } = req.params;

    const bookings = await this.getUserBookings.execute({ userId });
    return res.json(bookings);
  }

  async cancel(req: Request, res: Response) {
    const { id } = req.params;

    const booking = await this.cancelBooking.execute({ bookingId: id });
    return res.json(booking);
  }
} 