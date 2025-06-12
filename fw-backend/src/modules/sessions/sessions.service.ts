import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Session } from '@prisma/client';
import { PrismaService } from '../thirdparty/prisma/prisma.service';

type TrackSessionArgs = {
  userId: string;
  sessionId?: string;
  productId: string;
};

@Injectable()
export class SessionsService {
  constructor(private readonly prismaService: PrismaService) {}

  @OnEvent('product.visited')
  async handleProductVisited({
    productId,
    userId,
    sessionId,
  }: TrackSessionArgs): Promise<void> {
    const sessionExists = await this.getSession(sessionId);

    if (sessionExists) {
      await this.addProductToSession(sessionId, productId);
      return;
    }

    const session = await this.generateSession(userId);
    await this.addProductToSession(session.sessionId, productId);
  }

  async getSession(sessionId: string) {
    return this.prismaService.session.findUnique({
      where: { sessionId },
    });
  }

  async generateSession(userId: string): Promise<Session> {
    const newSession = await this.prismaService.session.create({
      data: {
        userId,
      },
    });

    return newSession;
  }

  async addProductToSession(sessionId: string, productId: string) {
    return await this.prismaService.sessionVisits.create({
      data: {
        sessionId,
        productId,
      },
    });
  }
}
