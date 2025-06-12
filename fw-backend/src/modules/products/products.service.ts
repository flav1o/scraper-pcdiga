import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Price } from '@prisma/client';
import * as dayjs from 'dayjs';
import { List } from 'src/common/types.gql';
import { PrismaService } from 'src/modules/thirdparty/prisma/prisma.service';
import { genCheckSum } from 'src/utils/checksum';
import { ProductsElasticService } from './elastic/products-elastic.service';
import {
  CreateProductInput,
  GetProductsInput,
  ProductDetailsInput,
} from './gql/types/products.inputs';
import {
  ProductDetails,
  ProductWithHistory,
} from './gql/types/products.outputs';

@Injectable()
export class ProductService {
  constructor(
    private readonly productsElastic: ProductsElasticService,
    private readonly prisma: PrismaService,
  ) {}

  async createOrUpsertProduct(product: ProductDetailsInput): Promise<{
    wasCreateAction: boolean;
    data: ProductDetails;
    lastPrice: Price;
  }> {
    const date = dayjs().toISOString();
    const newProduct = await this.prisma.product.upsert({
      create: {
        ...product,
        lastScrapedAt: date,
        createdAt: date,
      },
      update: {
        lastScrapedAt: date,
      },
      where: {
        ean: product.ean,
      },
      include: {
        prices: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    const createdAtDate = dayjs(newProduct.createdAt).toISOString();
    const isCreateAction = dayjs(createdAtDate).isSame(date);

    return {
      data: newProduct,
      wasCreateAction: !!isCreateAction,
      lastPrice: newProduct?.prices[0],
    };
  }

  async getProducts(
    filters: GetProductsInput,
    list: List,
  ): Promise<ProductWithHistory[]> {
    const skip = list?.skip ?? 0;
    const total = list?.total ?? 100;

    const data = await this.prisma.product.findMany({
      skip: skip * total,
      take: list?.total ?? 10,
      include: {
        prices: {
          where: {
            createdAt: {
              gte: dayjs().subtract(1, 'month').toISOString(),
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: filters?.sortOrder ?? 'desc',
      },
    });

    const normalizeData = data.map(({ prices, ...product }) => ({
      prices: prices,
      product,
    }));

    return normalizeData;
  }

  async getProduct(key: string): Promise<ProductDetails> {
    const todayLess1Month = dayjs().subtract(31, 'days').toISOString();

    return await this.prisma.product.findFirst({
      where: {
        OR: [{ productId: key }, { ean: key }],
        lastScrapedAt: { gte: todayLess1Month },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  validateChecksum(data: CreateProductInput, checksum: string): boolean {
    const serverChecksum = genCheckSum(data)?.toString();
    const matches = serverChecksum === checksum?.toString();

    if (!matches) {
      throw new HttpException('product.invalid_date', HttpStatus.CONFLICT);
    }

    return matches;
  }
}
