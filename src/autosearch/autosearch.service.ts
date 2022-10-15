import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Cron } from '@nestjs/schedule';
import { ENTITIES_KEY } from 'src/shared';
import { InjectModel } from '@nestjs/mongoose';
import { ProductAutoSearch } from 'src/graphql/graphql-schema';
import { ProductsService } from 'src/products/products.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { findProductsToSearch } from './autosearch.utils';

@Injectable()
export class AutosearchService {
  constructor(
    @InjectModel(ENTITIES_KEY.AUTO_SEARCH_MODEL)
    private autoSearchModel: Model<ProductAutoSearch>,
    private productService: ProductsService,
  ) {}

  async addProductToAutoSearch(productUrl: string): Promise<boolean> {
    const productInAutoSearch = await this.autoSearchModel.findOne({
      url: productUrl,
    });

    if (productInAutoSearch) {
      throw new HttpException(
        'ERROR.PRODUCT_ALREADY_IN_AUTOSEARCH',
        HttpStatus.CONFLICT,
      );
    }

    return !!(await new this.autoSearchModel({
      url: productUrl,
      isActive: true,
      hash: uuid(),
    }).save());
  }

  @Cron('0 0 0 * * *')
  async autoSearch() {
    const productsToSearch = await findProductsToSearch(this.autoSearchModel);

    for (const product of productsToSearch) {
      await this.productService.getProduct(
        product.url,
        new Date().toISOString(),
      );
    }
  }
}
