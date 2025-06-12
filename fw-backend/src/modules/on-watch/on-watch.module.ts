import { Module } from '@nestjs/common';
import { PricesModule } from '../prices/prices.module';
import { ProductsModule } from '../products/products.module';
import { MailerModule } from '../thirdparty/mailer/mailer.module';
import { RabbitMqModule } from '../thirdparty/rabbitmq/rabbitmq.module';
import { OnWatchResolver } from './gql/on-watch.resolver';
import { OnWatchController } from './on-watch.webook';
import { OnWatchService } from './on-watch.service';

@Module({
  providers: [OnWatchResolver, OnWatchService],
  controllers: [OnWatchController],
  imports: [ProductsModule, RabbitMqModule, PricesModule, MailerModule],
})
export class OnWatchModule {}
