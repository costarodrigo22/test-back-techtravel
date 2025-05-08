import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

interface ISendEmailParams {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

export class SESGateway {
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
