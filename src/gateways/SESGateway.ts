import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import {
  IEmailGateway,
  ISendEmailParams,
} from '../interfaces/gateways/IEmailGateway';

export class SESGateway implements IEmailGateway {
  private client = new SESClient();

  async sendEmail({
    from,
    to,
    subject,
    html,
  }: ISendEmailParams): Promise<void> {
    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Charset: 'utf-8',
          Data: subject,
        },
        Body: {
          Html: {
            Charset: 'utf-8',
            Data: html,
          },
        },
      },
    });

    await this.client.send(command);
  }
}
