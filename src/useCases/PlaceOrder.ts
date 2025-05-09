import { Order } from '../entities/Order';
import { IOrdersRepository } from '../interfaces/repositories/IOrdersRepository';
import { IQueueGateway } from '../interfaces/gateways/IQueueGateway';
import { IEmailGateway } from '../interfaces/gateways/IEmailGateway';

export class PlaceOrder {
  constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly queueGateway: IQueueGateway,
    private readonly emailGateway: IEmailGateway
  ) {}
  async execute() {
    const customerEmail = 'drigo_123_123@hotmail.com';
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);

    this.ordersRepository.create(order);

    this.queueGateway.publishMessage({ orderId: order.id });

    this.emailGateway.sendEmail({
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
