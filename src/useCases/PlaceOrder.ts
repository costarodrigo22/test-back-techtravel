import { Order } from '../entities/Order';
import { DynamoOrdersRepository } from '../repository/DynamoOrdersRepository';
import { SQSGateway } from '../gateways/SQSGateway';
import { SESGateway } from '../gateways/SESGateway';

export class PlaceOrder {
  async execute(
    dynamoOrderRepository: DynamoOrdersRepository,
    sqsGateway: SQSGateway,
    sesGateway: SESGateway
  ) {
    const customerEmail = 'drigo_123_123@hotmail.com';
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);

    dynamoOrderRepository.create(order);

    sqsGateway.publishMessage({ orderId: order.id });

    sesGateway.sendEmail({
      from: 'costarodrigosilva247@gmail.com',
      to: [customerEmail],
      subject: `O pedido #${order.id} foi confirmado`,
      html: `
        <h1>E ai meu cumpadi</h1>

        <p>Passado aqui pra avisar que o seu pedido foi confirmado</p>

        <small>{{ tabela com os itens do pedido }}</small>
      `,
    });

    return { orderId: order.id };
  }
}
