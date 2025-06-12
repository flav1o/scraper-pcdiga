import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { MailerService } from '../thirdparty/mailer/mailer.service';
import { PrismaService } from '../thirdparty/prisma/prisma.service';
import { RabbitMqService } from '../thirdparty/rabbitmq/rabbitmq.service';

@Injectable()
export class OnWatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMqService,
    private readonly mailer: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_10_HOURS, {
    waitForCompletion: true,
  })
  private async _handleCron() {
    const todayLess1Month = dayjs().subtract(31, 'days').toISOString();
    const condition = { lastScrapedAt: { gte: todayLess1Month } };

    const take = 5;
    const count = await this.prisma.product.count({ where: condition });
    const totalPages = Math.ceil(count / take);

    for (let page = 0; page < totalPages; page++) {
      const skip = page * take;

      const products = await this.prisma.product.findMany({
        where: condition,
        skip,
        take,
      });

      await Promise.all(
        products.map((product) =>
          this.rabbitmq.addProductToQueue({
            productId: product.productId,
            url: product.url,
            company: 'PC_DIGA',
          }),
        ),
      );
    }
  }

  async addOnWatch(productId: string, userId: string, targetPrice?: number) {
    return await this.prisma.onWatch.upsert({
      create: {
        userId,
        productId,
        targetPrice,
      },
      update: {
        targetPrice,
      },
      where: { productId_userId: { productId, userId } },
    });
  }

  async removeOnWatch(productId: string, userId: string) {
    return await this.prisma.onWatch.delete({
      where: { productId_userId: { productId, userId } },
    });
  }

  async getOnWatchByUser(userId: string) {
    const todayLess1Month = dayjs().subtract(1, 'month').toDate();
    const products = await this.prisma.onWatch.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            prices: {
              where: {
                createdAt: {
                  gte: todayLess1Month,
                },
              },
            },
          },
        },
      },
    });

    return products.map(({ watchId, product, targetPrice }) => ({
      product,
      watchId,
      targetPrice: targetPrice ? Number(targetPrice) : null,
    }));
  }

  async isProductOnUserWatchList(productId: string, userId: string) {
    return await this.prisma.onWatch.findFirst({
      where: {
        userId,
        productId,
      },
    });
  }

  async getOnWatchUsersToNotify(
    productId: string,
    page: number,
    take: number,
    currentPrice,
  ) {
    const users = await this.prisma.onWatch.findMany({
      where: {
        productId,
        targetPrice: { gte: currentPrice },
      },
      skip: page * take,
      take,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return users;
  }

  getTotalOnWatchUsersToNotify(productId: string, currentPrice: number) {
    return this.prisma.onWatch.count({
      where: {
        productId,
        targetPrice: { gte: currentPrice },
      },
    });
  }

  @OnEvent('product.scraped')
  async notifyOnWatchUsers({ productId }: { productId: string }) {
    console.log('🔔 PRODUCT SCRAPED EVENT RECEIVED for productId:', productId);

    const product = await this.prisma.product.findUnique({
      where: { productId },
      include: {
        prices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!product) {
      console.log('❌ Product not found:', productId);
      return;
    }

    const discountPrice = product.prices[0]?.discountPrice;
    const originalPrice = product.prices[0]?.originalPrice;
    const currentPrice = discountPrice ?? originalPrice;

    const totalUsers = await this.getTotalOnWatchUsersToNotify(
      productId,
      Number(currentPrice),
    );

    console.log('👥 Total users to notify:', totalUsers);

    if (totalUsers === 0) {
      return;
    }

    const take = 10;
    const totalPages = Math.ceil(totalUsers / take);

    for (let page = 0; page < totalPages; page++) {
      const users = await this.getOnWatchUsersToNotify(
        productId,
        page,
        take,
        currentPrice,
      );

      console.log(
        `📄 Page ${page + 1}/${totalPages} - Users found:`,
        users.length,
      );

      await Promise.all(
        users.map((user) => {
          console.log('📧 Sending email to:', user.user.email);
          return this.mailer.addEmailToQueue({
            discountPrice: Number(currentPrice),
            originalPrice: Number(originalPrice),
            productName: product.name,
            productUrl: product.url,
            productImageUrl: product.image,
            to: user.user.email,
            subject: `Product Price Alert! ${product.name} is now €${currentPrice.toFixed(2)}`,
          });
        }),
      );
    }

    console.log('✅ Email notification process completed');
  }
}
