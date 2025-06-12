import { Field, ObjectType } from '@nestjs/graphql';
import { Store } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@ObjectType()
export class ProductPrice {
  @Field(() => String)
  priceId: string;

  @Field(() => String)
  productId: string;

  @Field(() => Number)
  originalPrice: number | Decimal;

  @Field(() => Number, { nullable: true })
  discountPrice?: number | Decimal;

  @Field(() => Number)
  createdAt: Date;

  @Field(() => Store)
  store: Store;
}
