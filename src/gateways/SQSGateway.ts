import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

export class SQSGateway {
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
