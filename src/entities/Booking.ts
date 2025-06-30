import { randomUUID } from 'node:crypto';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export class Booking {
  public id: string;
  public user_id: string;
  public itinerary_id: string;
  public status: BookingStatus;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    user_id: string,
    itinerary_id: string,
    status: BookingStatus = BookingStatus.CONFIRMED
  ) {
    this.id = randomUUID();
    this.user_id = user_id;
    this.itinerary_id = itinerary_id;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
} 