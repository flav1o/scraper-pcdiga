import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from 'src/graphql/graphql-schema';
import { ProductsService } from '../products.service';

@Resolver('Product')
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query('getProduct')
  async getProblem(
    @Args('ean') ean: string,
    @Args('url') url: string,
  ): Promise<Product> {
    return this.productsService.getProduct(ean, url);
  }
}
