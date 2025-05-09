import fastify from 'fastify';

import { makePlaceOrder } from './factories/makePlaceOrder';

const app = fastify();

app.post('/orders', async (request, reply) => {
  const placeOrder = makePlaceOrder();

  const { orderId } = await placeOrder.execute();

  reply.status(201).send({ orderId });
});

app.listen({ port: 3000 }).then(() => {
  console.log('> server running at http://localhost:3000');
});
