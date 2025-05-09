export interface ISendEmailParams {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

export interface IEmailGateway {
  sendEmail: (params: ISendEmailParams) => Promise<void>;
}
