import { SQSGateway } from '../gateways/SQSGateway';

export function makeSQSGateway() {
  return new SQSGateway();
}
