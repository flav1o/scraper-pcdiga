import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  calculateDiscountPercentage,
  isCurrentMonthAndYear,
  isOlderThan24Hours,
} from 'src/common/utils';
import { Product } from 'src/graphql/graphql-schema';
import { ScraperService } from 'src/scraper/scraper.service';
import { ENTITIES_KEY } from 'src/shared';
import * as _ from 'lodash';
import { ThirdPartyEmailService } from 'src/third-party/third-party.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ENTITIES_KEY.PRODUCTS_MODEL)
    private productModel: Model<Product>,
    private scraperService: ScraperService,
    private readonly sendgridService: ThirdPartyEmailService,
  ) {}

  async createProduct(productUrl: string): Promise<Product> {
    const { currentPrice, originalPrice, priceDifference, name, ean } =
      await this.scraperService.pageScraping(productUrl);

    if (!currentPrice)
      throw new HttpException(
        'ERROR.COULDNT_CREATE_PRODUCT',
        HttpStatus.NOT_FOUND,
      );

    return await new this.productModel({
      url: productUrl,
      name,
      ean,
      prices: {
        currentPrice,
        originalPrice,
        priceDifference,
        isOnDiscount: priceDifference > 0,
        discountPercentage: ((priceDifference / originalPrice) * 100).toFixed(
          2,
        ),
      },
    }).save();
  }

  async getPrices(productUrl: string): Promise<Product> {
    const { currentPrice, originalPrice, priceDifference } =
      await this.scraperService.pageScraping(productUrl);

    if (!currentPrice)
      throw new HttpException(
        'ERROR.COULDNT_CREATE_PRODUCT',
        HttpStatus.NOT_FOUND,
      );

    const product = await this.productModel.findOneAndUpdate(
      { url: productUrl },
      {
        $push: {
          prices: {
            currentPrice,
            originalPrice,
            priceDifference,
            isOnDiscount: priceDifference > 0,
            discountPercentage: calculateDiscountPercentage(
              priceDifference,
              originalPrice,
            ),
          },
        },
      },
    );

    return product;
  }

  async getProduct(url: string, date: string): Promise<Product> {
    let priceDate;

    date ? (priceDate = new Date(date)) : (priceDate = new Date());

    const product = await this.productModel
      .aggregate([
        {
          $match: {
            url,
          },
        },
        {
          $project: {
            _id: 1,
            url: 1,
            name: 1,
            ean: 1,
            updatedAt: 1,
            prices: {
              $filter: {
                input: '$prices',
                as: 'price',
                cond: {
                  $and: [
                    {
                      $eq: [
                        { $month: '$$price.createdAt' },
                        priceDate.getMonth() + 1,
                      ],
                    },
                    {
                      $eq: [
                        { $year: '$$price.createdAt' },
                        priceDate.getFullYear(),
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      ])
      .exec();

    if (product.length === 0) return await this.createProduct(url);

    if (
      isOlderThan24Hours(_.head(product).updatedAt) &&
      isCurrentMonthAndYear(priceDate)
    ) {
      return await this.getPrices(url);
    }

    const { ean, name, prices } = _.head(product);

    this.sendgridService.send(ean, name, url, _.head(prices));

    return _.head(product);
  }
}
