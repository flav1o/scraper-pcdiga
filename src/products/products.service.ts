import * as _ from 'lodash';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/graphql/graphql-schema';
import { aggregateProductData } from './products.utils';
import { ScraperService } from 'src/scraper/scraper.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ENTITIES_KEY } from 'src/shared';
import {
  calculateDiscountPercentage,
  isCurrentMonthAndYear,
  isOlderThan24Hours,
} from 'src/common/utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ENTITIES_KEY.PRODUCTS_MODEL)
    private readonly productModel: Model<Product>,
    private readonly scraperService: ScraperService,
  ) {}

  async getProduct(url: string, date: string): Promise<Product> {
    const priceDate = date ? new Date(date) : new Date();

    const product = await aggregateProductData(
      this.productModel,
      url,
      priceDate,
    );

    if (!product.length) return await this.createProduct(url);

    const shouldCreateNewPrice =
      isOlderThan24Hours(_.head(product).updatedAt) &&
      isCurrentMonthAndYear(priceDate);

    if (shouldCreateNewPrice) {
      return await this.createPrice(url);
    }

    return _.head(product);
  }

  async createProduct(productUrl: string): Promise<Product> {
    const {
      currentPrice,
      originalPrice,
      priceDifference,
      name,
      ean,
      productImage,
    } = await this.scraperService.pageScraping(productUrl);

    if (!currentPrice)
      throw new HttpException(
        'ERROR.COULD_NOT_CREATE_PRODUCT',
        HttpStatus.NOT_FOUND,
      );

    const verifiedOriginalPrice =
      priceDifference > 0 ? originalPrice : currentPrice;

    const verifiedPriceDifference = priceDifference > 0 ? priceDifference : 0;

    return await new this.productModel({
      name,
      ean,
      productImage,
      url: productUrl,
      prices: {
        currentPrice,
        originalPrice: verifiedOriginalPrice,
        priceDifference: verifiedPriceDifference,
        isOnDiscount: priceDifference > 0,
        discountPercentage: calculateDiscountPercentage(
          verifiedPriceDifference,
          verifiedOriginalPrice,
        ),
      },
    }).save();
  }

  async createPrice(productUrl: string): Promise<Product> {
    const { currentPrice, originalPrice, priceDifference } =
      await this.scraperService.pageScraping(productUrl);

    if (!currentPrice)
      throw new HttpException(
        'ERROR.COULD_NOT_ADD_PRICE',
        HttpStatus.NOT_FOUND,
      );

    const verifiedOriginalPrice =
      priceDifference > 0 ? originalPrice : currentPrice;

    const verifiedPriceDifference = priceDifference > 0 ? priceDifference : 0;

    const product = await this.productModel.findOneAndUpdate(
      { url: productUrl },
      {
        $push: {
          prices: {
            currentPrice,
            originalPrice: verifiedOriginalPrice,
            priceDifference: verifiedPriceDifference,
            isOnDiscount: priceDifference > 0,
            discountPercentage: (
              (verifiedPriceDifference / verifiedOriginalPrice) *
              100
            ).toFixed(2),
          },
        },
      },
    );

    return product;
  }

  async getProductByUrl(productUrl: string): Promise<Product> {
    return await this.productModel.findOne({ url: productUrl });
  }
}
