import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductAutoSearch } from 'src/graphql/graphql-schema';
import { ENTITIES_KEY } from 'src/shared';
import { Cron } from '@nestjs/schedule';
import { v4 as uuid } from 'uuid';
import { ProductsService } from 'src/products/products.service';

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

  @Cron('0 0 * * * *')
  async autoSearch() {
    /*
    TODO: search and update products 
    in auto searchcollection with 
    isActive: true
    */
  }
}
