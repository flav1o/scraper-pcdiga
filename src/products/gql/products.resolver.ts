import { Resolver, Query, Args } from '@nestjs/graphql';
import { Product } from 'src/graphql/graphql-schema';
import { ProductsService } from '../products.service';

@Resolver('Product')
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query('getProduct')
  async getProblem(
    @Args('url') url: string,
    @Args('priceDate') date?: string,
  ): Promise<Product> {
    return this.productsService.getProduct(url, date);
  }
}
