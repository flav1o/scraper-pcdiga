import { Field, InputType } from '@nestjs/graphql';
import { Store } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

@InputType()
export class ProductPriceInput {
  @Field(() => String)
  productId: string;

  @Field(() => Number)
  originalPrice: number;

  @Field(() => Number, { nullable: true })
  discountPrice?: number;
}

@InputType()
export class NoProductIdPriceInput {
  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  originalPrice: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  discountPrice?: number;

  @Field(() => Store)
  @IsEnum(Store)
  store: Store;
}
