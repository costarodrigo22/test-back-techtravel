import { Booking } from '../../entities/Booking';

export interface IBookingsRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByItineraryId(itineraryId: string): Promise<Booking[]>;
  update(id: string, booking: Partial<Booking>): Promise<Booking | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Booking[]>;
} 