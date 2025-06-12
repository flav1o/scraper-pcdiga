import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMqController } from './rabbitmq.controller';
import { RabbitMqService } from './rabbitmq.service';

@Module({
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
  imports: [
    ClientsModule.register([
      {
        name: 'EMAILS_QUEUE',
        transport: Transport.RMQ,
        options: {
          noAck: true,
          urls: ['amqp://localhost:5672'],
          queue: 'emails_queue',
          persistent: true,
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'SCRAPER_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'scraper_queue',
          persistent: true,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
