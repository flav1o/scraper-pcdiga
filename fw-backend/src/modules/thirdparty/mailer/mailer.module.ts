import { Global, Module } from '@nestjs/common';
import { RabbitMqModule } from '../rabbitmq/rabbitmq.module';
import { EmailsConsumerService } from './mailer.consumer';
import { MailerService } from './mailer.service';
import { NodeMailerTransporterProvider } from './providers/nodemailer.provider';
import { TemplateService } from './template.service';

@Global()
@Module({
  imports: [RabbitMqModule],
  providers: [MailerService, TemplateService, NodeMailerTransporterProvider],
  exports: [MailerService],
  controllers: [EmailsConsumerService],
})
export class MailerModule {}
