import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { NestCrawlerModule } from 'nest-crawler';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductsModule } from './products/products.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AutosearchModule } from './autosearch/autosearch.module';
import { ThirdPartyModule } from './third-party/third-party.module';
import { ThirdPartyEmailService } from './third-party/third-party.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/pcdigascraper', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typePaths: ['./**/*.graphql'],
      driver: ApolloDriver,
      definitions: {
        path: join(process.cwd(), 'src/graphql-schema.ts'),
        customScalarTypeMapping: {
          DateTime: 'Date',
        },
      },
    }),
    ProductsModule,
    NestCrawlerModule,
    AutosearchModule,
    ThirdPartyModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, ThirdPartyEmailService],
})
export class AppModule {}
