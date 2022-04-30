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

  async getProduct(url: string): Promise<Product> {
    const product = await this.productModel.findOne({ url }).lean();

    if (product) return product;
    return await this.createProduct(url);
  }
}
