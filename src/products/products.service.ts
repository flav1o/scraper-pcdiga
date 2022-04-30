import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/graphql/graphql-schema';
import { ScraperService } from 'src/scraper/scraper.service';
import { ENTITIES_KEY } from 'src/shared';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ENTITIES_KEY.PRODUCTS_MODEL)
    private productModel: Model<Product>,
    private scraperService: ScraperService,
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
            discountPercentage: (
              (priceDifference / originalPrice) *
              100
            ).toFixed(2),
          },
        },
      },
    );

    return product;
  }

  async getProduct(url: string): Promise<Product> {
    const product = await this.productModel.findOne({ url }).lean();

    if (!product) return await this.createProduct(url);

    //TODO: make this an util function
    const date = new Date(product.updatedAt);
    const lastScrapedWas24Plus = date.getTime() < Date.now() - 86400000;

    if (product && !lastScrapedWas24Plus) return product;
    if (product && lastScrapedWas24Plus) return this.getPrices(url);
  }
}
