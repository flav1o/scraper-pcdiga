import { Field, ObjectType } from '@nestjs/graphql';
import { ProductPrice } from 'src/modules/prices/gql/types/prices.outputs';
import { ProductDetails } from 'src/modules/products/gql/types/products.outputs';

@ObjectType()
class ProductWithPrices extends ProductDetails {
  @Field(() => [ProductPrice])
  prices: ProductPrice[];
}

@ObjectType()
export class ProductsWatchList {
  @Field(() => String)
  watchId: string;

  @Field(() => ProductWithPrices)
  product: ProductWithPrices;

  @Field(() => Number, { nullable: true })
  targetPrice?: number;
}

@ObjectType()
export class OnWatchInfo {
  productId: string;
  userId: string;
}
