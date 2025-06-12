import { Inject, Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { RabbitMqService } from '../rabbitmq/rabbitmq.service';
import { PriceEmailData, SendEmail } from './mailer.types';
import { TemplateService } from './template.service';

@Injectable()
export class MailerService {
  constructor(
    @Inject('NODEMAILER_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
    private readonly rabbitmq: RabbitMqService,
    private readonly templateService: TemplateService,
  ) {}

  async prioritySendEmail(mailOptions: SendEmail) {
    try {
      await this.transporter.sendMail({
        ...mailOptions,
        from: 'a20349@alunos.ipca.pt',
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async addEmailToQueue(emailData: PriceEmailData) {
    const priceEmailData = emailData as PriceEmailData;
    const html =
      this.templateService.generatePriceEmailTemplate(priceEmailData);
    const mailOptions: SendEmail = {
      to: priceEmailData.to,
      subject: priceEmailData.subject,
      html: html,
      text: `Special offer: ${priceEmailData.productName} now €${priceEmailData.discountPrice.toFixed(2)} (was €${priceEmailData.originalPrice.toFixed(2)})`,
    };

    await this.rabbitmq.addEmailToQueue(mailOptions);
  }
}
