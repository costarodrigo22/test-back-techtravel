import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { Order } from '../entities/Order';

export class DynamoOrdersRepository {
  private client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async create(order: Order): Promise<void> {
    const command = new PutCommand({
      TableName: 'Orders',
      Item: order,
    });

    await this.client.send(command);
  }
}
