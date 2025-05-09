import { SESGateway } from '../gateways/SESGateway';

export function makeSESGateway() {
  return new SESGateway();
}
