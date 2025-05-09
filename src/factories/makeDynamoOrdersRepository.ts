import { DynamoOrdersRepository } from '../repository/DynamoOrdersRepository';

export function makeDynamoOrdersRepository() {
  return new DynamoOrdersRepository();
}
