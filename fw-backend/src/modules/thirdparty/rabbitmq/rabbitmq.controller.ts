import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RabbitMqService } from './rabbitmq.service';

@Controller()
export class RabbitMqController {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  @OnEvent('on_watch.scrape')
  async handleScrapeEvent(payload: any) {
    return await this.rabbitMqService.addProductToQueue(payload);
  }
}
