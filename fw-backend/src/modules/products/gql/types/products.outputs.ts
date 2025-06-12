import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Store } from '@prisma/client';
import { ProductPrice } from 'src/modules/prices/gql/types/prices.outputs';

export enum PriceOpportunityClassification {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

registerEnumType(PriceOpportunityClassification, {
  name: 'PriceOpportunityClassification',
});

@ObjectType()
export class PriceOpportunityEvaluation {
  @Field(() => String)
  productId: string;

  @Field(() => PriceOpportunityClassification)
  classification: PriceOpportunityClassification;

  @Field(() => Number)
  currentPrice: number;

  @Field(() => Number)
  currentOriginalPrice: number;

  @Field(() => Number, { nullable: true })
  currentDiscountPrice?: number;

  @Field(() => Boolean)
  hasCurrentDiscount: boolean;

  @Field(() => Number)
  averagePrice: number;

  @Field(() => Number)
  minPrice: number;

  @Field(() => Number)
  maxPrice: number;

  @Field(() => Number)
  totalPriceRecords: number;
}

@ObjectType()
export class ProductDetails {
  @Field(() => String)
  productId: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  ean: string;

  @Field(() => Number)
  lastScrapedAt: Date;

  @Field(() => String)
  url: string;

  @Field(() => Number)
  createdAt: Date;
}

@ObjectType()
export class Product {
  @Field(() => ProductDetails)
  product: ProductDetails;

  @Field(() => [ProductPrice])
  prices: ProductPrice[];
}

@ObjectType()
export class ProductLite {
  @Field(() => String)
  productId: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;
}

@ObjectType()
export class ProductWithHistory {
  @Field(() => ProductDetails)
  product: ProductDetails;

  @Field(() => [ProductPrice])
  prices: ProductPrice[];
}

@ObjectType()
export class PriceHistoryPoint {
  @Field(() => Date)
  date: Date;

  @Field(() => Number)
  price: number;

  @Field(() => Number, { nullable: true })
  discountPrice?: number;

  @Field(() => Store)
  store: Store;
}

@ObjectType()
export class PriceHistory {
  @Field(() => String)
  productId: string;

  @Field(() => [PriceHistoryPoint])
  history: PriceHistoryPoint[];
}
