import { Provider } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export const NodeMailerTransporterProvider: Provider = {
  provide: 'NODEMAILER_TRANSPORTER',
  useFactory: () => {
    return nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_USER_PASSWORD,
      },
    });
  },
};
