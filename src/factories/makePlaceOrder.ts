import { PlaceOrder } from '../useCases/PlaceOrder';
import { makeDynamoOrdersRepository } from './makeDynamoOrdersRepository';
import { makeSESGateway } from './makeSESGateway';
import { makeSQSGateway } from './makeSQSGateway';

export function makePlaceOrder() {
  return new PlaceOrder(
    makeDynamoOrdersRepository(),
    makeSQSGateway(),
    makeSESGateway()
  );
}
