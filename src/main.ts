import fastify from 'fastify';
import { PlaceOrder } from './useCases/PlaceOrder';
import { DynamoOrdersRepository } from './repository/DynamoOrdersRepository';
import { SQSGateway } from './gateways/SQSGateway';
import { SESGateway } from './gateways/SESGateway';

const app = fastify();

app.post('/orders', async (request, reply) => {
  const placeOrder = new PlaceOrder();
  const dynamoOrderRepository = new DynamoOrdersRepository();
  const sqsGateway = new SQSGateway();
  const sesGateway = new SESGateway();

  const { orderId } = await placeOrder.execute(
    dynamoOrderRepository,
    sqsGateway,
    sesGateway
  );

  reply.status(201).send({ orderId });
});

app.listen({ port: 3000 }).then(() => {
  console.log('> server running at http://localhost:3000');
});
