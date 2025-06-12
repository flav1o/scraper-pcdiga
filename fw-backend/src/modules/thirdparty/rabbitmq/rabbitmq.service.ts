import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject('SCRAPER_QUEUE') private readonly scraperQueueClient: ClientRMQ,
    @Inject('EMAILS_QUEUE') private readonly emailsQueueClient: ClientRMQ,
  ) {}

  async addProductToQueue(message: any) {
    return this.scraperQueueClient.emit('scrape_product', message);
  }

  async addEmailToQueue(message: any) {
    return this.emailsQueueClient.emit('send_email', message);
  }
}
