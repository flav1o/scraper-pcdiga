import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { EventEmitter2 } from '@nestjs/event-emitter';
import * as dayjs from 'dayjs';
import { ProductChecksum } from 'src/common/decorators/checksum.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SessionId } from 'src/common/decorators/session.decorator';
import { List } from 'src/common/types.gql';
import { SCRAPING_TIME_THRESHOLD_HOURS } from 'src/constants';
import { GqlAuthGuard } from 'src/modules/auth/guards/super.guard';
import { CurrUser } from 'src/modules/auth/types';
import { PricesService } from 'src/modules/prices/prices.service';
import { PrismaService } from 'src/modules/thirdparty/prisma/prisma.service';
import { ProductsElasticService } from '../elastic/products-elastic.service';
import { _generateFakeData } from '../fake-data';
import { ProductService } from '../products.service';

import {
  CreateProductInput,
  GetPriceHistoryInput,
  GetProductsInput,
  GetProductsLiteInput,
} from './types/products.inputs';
import {
  PriceHistory,
  PriceOpportunityClassification,
  PriceOpportunityEvaluation,
  Product,
  ProductDetails,
  ProductLite,
  ProductWithHistory,
} from './types/products.outputs';

@Resolver()
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly pricesService: PricesService,
    private readonly productsElasticService: ProductsElasticService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(GqlAuthGuard('jwt'))
  @Mutation(() => ProductDetails, { name: 'product' })
  async upsertProduct(
    @Args('input') input: CreateProductInput,
    @SessionId() sessionId: string,
    @CurrentUser() currUser: CurrUser,
    @ProductChecksum() checksum: string,
  ): Promise<ProductDetails> {
    this.productService.validateChecksum(input, checksum);

    const {
      data: productData,
      wasCreateAction,
      lastPrice,
    } = await this.productService.createOrUpsertProduct(input.product);

    if (wasCreateAction) {
      await this.productsElasticService.createProduct(productData);
    }

    const lastScrapedTimeDiff = dayjs().diff(
      dayjs(lastPrice?.createdAt),
      'hours',
    );

    if (!lastPrice || lastScrapedTimeDiff > SCRAPING_TIME_THRESHOLD_HOURS) {
      await this.pricesService.createProductPrice(
        { productId: productData.productId, ...input.price },
        currUser.userId,
        checksum,
      );
    }

    this.eventEmitter.emit('product.visited', {
      userId: currUser.userId,
      productId: productData.productId,
      sessionId,
    });

    return productData;
  }

  @Query(() => Product)
  async product(@Args('key') key: string): Promise<Product> {
    const product = await this.productService.getProduct(key);

    if (!product) {
      throw new HttpException('product.not_found', HttpStatus.NOT_FOUND);
    }

    const prices = await this.pricesService.getProductPrices(product.productId);

    return { product, prices: prices || [] };
  }

  @Query(() => [ProductDetails])
  async productsLite(
    @Args('filters') filters: GetProductsLiteInput,
  ): Promise<ProductLite[]> {
    return await this.productsElasticService.getProducts(filters);
  }

  @Query(() => [ProductWithHistory])
  async products(
    @Args('filters', { nullable: true })
    productFilters: GetProductsInput,
    @Args('list', { nullable: true })
    list: List,
  ): Promise<ProductWithHistory[]> {
    const productsWithPrices = await this.productService.getProducts(
      productFilters,
      list,
    );

    return productsWithPrices;
  }

  @Query(() => [ProductDetails])
  async generateFakeData() {
    return _generateFakeData(this.prisma, this.productsElasticService);
  }

  @Query(() => PriceOpportunityEvaluation)
  async evaluatePriceOpportunity(
    @Args('productId') productId: string,
  ): Promise<PriceOpportunityEvaluation> {
    // Get all historical prices for the product
    const priceHistory =
      await this.pricesService.getAllProductPricesHistory(productId);

    if (!priceHistory || priceHistory.length === 0) {
      throw new HttpException('product.no_price_history', HttpStatus.NOT_FOUND);
    }

    const effectivePrices = priceHistory.map((price) => {
      const currentPrice = price.discountPrice
        ? Number(price.discountPrice)
        : Number(price.originalPrice);
      return currentPrice;
    });

    const currentPriceRecord = priceHistory[0]; // First item is the most recent (ordered desc)
    const currentPrice = effectivePrices[0];
    const currentOriginalPrice = Number(currentPriceRecord.originalPrice);
    const currentDiscountPrice = currentPriceRecord.discountPrice
      ? Number(currentPriceRecord.discountPrice)
      : null;
    const hasCurrentDiscount = !!currentPriceRecord.discountPrice;

    const minPrice = Math.min(...effectivePrices);
    const maxPrice = Math.max(...effectivePrices);
    const averagePrice =
      effectivePrices.reduce((sum, price) => sum + price, 0) /
      effectivePrices.length;

    const sortedPrices = [...effectivePrices].sort((a, b) => a - b);
    const percentile10Index = Math.floor(sortedPrices.length * 0.1);
    const percentile10Threshold = sortedPrices[percentile10Index];

    let classification: PriceOpportunityClassification;

    if (currentPrice <= percentile10Threshold) {
      classification = PriceOpportunityClassification.EXCELLENT;
    } else if (currentPrice < averagePrice) {
      classification = PriceOpportunityClassification.GOOD;
    } else if (currentPrice <= averagePrice * 1.1) {
      classification = PriceOpportunityClassification.NORMAL;
    } else {
      classification = PriceOpportunityClassification.HIGH;
    }

    return {
      productId,
      classification,
      currentPrice,
      currentOriginalPrice,
      currentDiscountPrice,
      hasCurrentDiscount,
      averagePrice: Math.round(averagePrice * 100) / 100,
      minPrice,
      maxPrice,
      totalPriceRecords: effectivePrices.length,
    };
  }

  @Query(() => PriceHistory)
  async getPriceHistory(
    @Args('input') input: GetPriceHistoryInput,
  ): Promise<PriceHistory> {
    const prices = await this.pricesService.getAllProductPricesHistory(
      input.productId,
      input.store,
      input.startDate,
      input.endDate,
    );

    // Transform to the format needed for the line chart
    const history = prices.map((price) => ({
      date: price.createdAt,
      price: Number(price.originalPrice),
      discountPrice: price.discountPrice ? Number(price.discountPrice) : null,
      store: price.store,
    }));

    return {
      productId: input.productId,
      history,
    };
  }
}
