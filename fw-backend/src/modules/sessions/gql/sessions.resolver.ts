import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/guards/super.guard';
import { CurrUser } from 'src/modules/auth/types';
import { SessionsService } from '../sessions.service';

@Resolver()
export class SessionsResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(GqlAuthGuard('jwt'))
  @Mutation(() => String)
  async generateSession(@CurrentUser() currUser: CurrUser) {
    const session = await this.sessionsService.generateSession(currUser.userId);
    return session.sessionId;
  }
}
