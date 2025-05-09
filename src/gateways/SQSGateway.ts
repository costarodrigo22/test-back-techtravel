import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { IQueueGateway } from '../interfaces/gateways/IQueueGateway';

export class SQSGateway implements IQueueGateway {
  private client = new SQSClient();

  async publishMessage(message: Record<string, unknown>): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl:
        'https://sqs.us-east-1.amazonaws.com/901381315351/orderQueueProject',
      MessageBody: JSON.stringify(message),
    });
    await this.client.send(command);
  }
}
