import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { SessionsResolver } from './gql/sessions.resolver';
import { SessionsService } from './sessions.service';

@Module({
  providers: [SessionsResolver, SessionsService],
  imports: [ProductsModule],
})
export class SessionsModule {}
