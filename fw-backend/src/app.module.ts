import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { OnWatchModule } from './modules/on-watch/on-watch.module';
import { PricesModule } from './modules/prices/prices.module';
import { ProductsModule } from './modules/products/products.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { GoogleAuthModule } from './modules/thirdparty/google-auth/google-auth.module';
import { PrismaModule } from './modules/thirdparty/prisma/prisma.module';
import { RabbitMqModule } from './modules/thirdparty/rabbitmq/rabbitmq.module';
import { UsersModule } from './modules/users/users.module';
import { MailerModule } from './modules/thirdparty/mailer/mailer.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    PricesModule,
    GoogleAuthModule,
    SessionsModule,
    RabbitMqModule,
    OnWatchModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
