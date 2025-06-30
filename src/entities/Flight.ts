export class Flight {
  public id: string;
  public flight_number: string;
  public airline_id: string;
  public origin_iata: string;
  public destination_iata: string;
  public departure_datetime: Date;
  public arrival_datetime: Date;
  public frequency: number[];
  public airline_iata_code?: string;

  constructor(
    id: string,
    flight_number: string,
    airline_id: string,
    origin_iata: string,
    destination_iata: string,
    departure_datetime: Date,
    arrival_datetime: Date,
    frequency: number[],
    airline_iata_code?: string
  ) {
    this.id = id;
    this.flight_number = flight_number;
    this.airline_id = airline_id;
    this.origin_iata = origin_iata;
    this.destination_iata = destination_iata;
    this.departure_datetime = departure_datetime;
    this.arrival_datetime = arrival_datetime;
    this.frequency = frequency;
    this.airline_iata_code = airline_iata_code;
  }
} 