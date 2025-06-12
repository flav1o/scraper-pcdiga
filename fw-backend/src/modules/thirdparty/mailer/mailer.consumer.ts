import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailerService } from './mailer.service';
import { SendEmail } from './mailer.types';

@Controller()
export class EmailsConsumerService {
  constructor(private readonly mailer: MailerService) {}

  @EventPattern('send_email')
  async handleSendEmail(
    @Payload() data: SendEmail,
    @Ctx() context: RmqContext,
  ) {
    await this.mailer.prioritySendEmail(data);

    const channel = context.getChannelRef();
    const msg = context.getMessage();
    channel.ack(msg);
  }
}
