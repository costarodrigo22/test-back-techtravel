export interface ItineraryFlight {
  id: string;
  flight_number: string;
  origin_iata: string;
  destination_iata: string;
  departure_datetime: Date;
  arrival_datetime: Date;
}

export class Itinerary {
  public id: string;
  public origin_iata: string;
  public destination_iata: string;
  public departure_datetime: Date;
  public arrival_datetime: Date;
  public total_duration_minutes: number;
  public stops: number;
  public flights: ItineraryFlight[];

  constructor(
    id: string,
    origin_iata: string,
    destination_iata: string,
    departure_datetime: Date,
    arrival_datetime: Date,
    total_duration_minutes: number,
    stops: number,
    flights: ItineraryFlight[]
  ) {
    this.id = id;
    this.origin_iata = origin_iata;
    this.destination_iata = destination_iata;
    this.departure_datetime = departure_datetime;
    this.arrival_datetime = arrival_datetime;
    this.total_duration_minutes = total_duration_minutes;
    this.stops = stops;
    this.flights = flights;
  }
} 