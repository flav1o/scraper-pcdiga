import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersResolver } from './gql/users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
