export class Airline {
  public id: string;
  public name: string;
  public iata_code: string;

  constructor(id: string, name: string, iata_code: string) {
    this.id = id;
    this.name = name;
    this.iata_code = iata_code;
  }
} 