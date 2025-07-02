import { Request, Response } from 'express';
import { CreateBooking } from '../useCases/booking/CreateBooking';
import { GetUserBookings } from '../useCases/booking/GetUserBookings';
import { CancelBooking } from '../useCases/booking/CancelBooking';

/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Cria uma nova reserva
 *     tags:
 *       - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               itinerary_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 */
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

  /**
   * @openapi
   * /bookings/user/{userId}:
   *   get:
   *     summary: Lista todas as reservas de um usuário
   *     tags:
   *       - Booking
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de reservas do usuário
   */
  async listUserBookings(req: Request, res: Response) {
    const { userId } = req.params;

    const bookings = await this.getUserBookings.execute({ userId });
    return res.json(bookings);
  }

  /**
   * @openapi
   * /bookings/{id}:
   *   delete:
   *     summary: Cancela uma reserva
   *     tags:
   *       - Booking
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Reserva cancelada com sucesso
   */
  async cancel(req: Request, res: Response) {
    const { id } = req.params;

    const booking = await this.cancelBooking.execute({ bookingId: id });
    return res.json(booking);
  }
} 