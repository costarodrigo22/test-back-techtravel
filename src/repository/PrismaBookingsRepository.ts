import { PrismaClient } from '../generated/prisma';
import { Booking, BookingStatus } from '../entities/Booking';
import { IBookingsRepository } from '../interfaces/repositories/IBookingsRepository';

export class PrismaBookingsRepository implements IBookingsRepository {
  private prisma = new PrismaClient();

  async create(booking: Booking): Promise<Booking> {
    const created = await this.prisma.booking.create({
      data: {
        id: booking.id,
        user_id: booking.user_id,
        itinerary_id: booking.itinerary_id,
        status: booking.status as any,
      },
    });
    return this.mapPrismaToBooking(created);
  }

  async findById(id: string): Promise<Booking | null> {
    const found = await this.prisma.booking.findUnique({ where: { id } });
    return found ? this.mapPrismaToBooking(found) : null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { user_id: userId },
    });
    return bookings.map(this.mapPrismaToBooking);
  }

  async findByItineraryId(itineraryId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { itinerary_id: itineraryId },
    });
    return bookings.map(this.mapPrismaToBooking);
  }

  async update(id: string, booking: Partial<Booking>): Promise<Booking | null> {
    const updated = await this.prisma.booking.update({
      where: { id },
      data: booking,
    });
    return updated ? this.mapPrismaToBooking(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({ where: { id } });
  }

  async findAll(): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany();
    return bookings.map(this.mapPrismaToBooking);
  }

  private mapPrismaToBooking(prismaBooking: any): Booking {
    const booking = new Booking(
      prismaBooking.user_id,
      prismaBooking.itinerary_id,
      prismaBooking.status as BookingStatus
    );
    booking.id = prismaBooking.id;
    booking.createdAt = prismaBooking.createdAt;
    booking.updatedAt = prismaBooking.updatedAt;
    return booking;
  }
} 