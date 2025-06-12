import { ExecutionContext, Injectable, Type, mixin } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export function GqlAuthGuard(strategy: string): Type {
  @Injectable()
  class SuperAuthGuard extends AuthGuard(strategy) {
    getRequest(context: ExecutionContext) {
      const ctx = GqlExecutionContext.create(context);

      return ctx.getContext().req;
    }
  }

  return mixin(SuperAuthGuard);
}
