import { Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';
import * as dayjs from 'dayjs';
import { ElasticsearchService } from '../thirdparty/elasticsearch/elasticsearch.service';
import { PrismaService } from '../thirdparty/prisma/prisma.service';
import { ProductPriceInput } from './gql/types/prices.inputs';
import { ProductPrice } from './gql/types/prices.outputs';

@Injectable()
export class PricesService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly prisma: PrismaService,
  ) {}

  async getProductPrices(
    productId: string,
    total?: number,
  ): Promise<ProductPrice[]> {
    const todayLess1Month = dayjs().subtract(31, 'days').toISOString();

    return await this.prisma.price.findMany({
      where: {
        productId: productId,
        createdAt: {
          gte: todayLess1Month,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: total,
    });
  }

  async getAllProductPricesHistory(
    productId: string,
    store?: Store,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ProductPrice[]> {
    const prices = await this.prisma.price.findMany({
      where: {
        productId: productId,
        store: store ? store : undefined,
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal to number
    return prices.map((price) => ({
      ...price,
      originalPrice: Number(price.originalPrice),
      discountPrice: price.discountPrice ? Number(price.discountPrice) : null,
    }));
  }

  async createProductPrice(
    input: ProductPriceInput,
    scrapedById: string,
    checksum: string,
  ): Promise<ProductPrice> {
    return await this.prisma.$transaction(async (tx) => {
      const newPrice = await tx.price.create({
        data: {
          productId: input.productId,
          originalPrice: input.originalPrice,
          discountPrice: input.discountPrice,
          hasDiscount: !!input?.discountPrice,
          scrapedById,
          checksum,
        },
      });

      await tx.product.update({
        where: { productId: input.productId },
        data: { lastScrapedAt: new Date() },
      });

      return newPrice;
    });
  }
}
