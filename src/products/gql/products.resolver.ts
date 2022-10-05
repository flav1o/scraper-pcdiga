import * as _ from 'lodash';
import { Product } from 'src/graphql/graphql-schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductsService } from '../products.service';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ICreatedProductEmitterPayload } from 'src/shared';
import { EMITTERS } from 'src/constants/emitters.constants';

@Resolver('Product')
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query('getProduct')
  async getProblem(
    @Args('url') url: string,
    @Args('notifyMe') notifyMe: boolean,
    @Args('priceDate') date?: string,
  ): Promise<Product> {
    const product = await this.productsService.getProduct(url, date);
    const { ean, name, prices } = product;

    if (notifyMe) {
      this.eventEmitter.emit(EMITTERS['EMAIL.NOTIFY_CREATED_PRODUCT'], {
        ean,
        name,
        url,
        prices: _.head(prices),
      } as ICreatedProductEmitterPayload);
    }

    return product;
  }
}
