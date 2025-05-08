import { randomUUID } from 'node:crypto';

export class Order {
  public id: string;
  constructor(public email: string, public amount: number) {
    this.id = randomUUID();
  }
}
