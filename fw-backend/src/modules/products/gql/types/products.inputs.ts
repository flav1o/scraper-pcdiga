import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Store } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { ValidateNestedType } from 'src/common/decorators/validate-nested.decorator';
import { SortOrder } from 'src/common/types.gql';
import { NoProductIdPriceInput } from 'src/modules/prices/gql/types/prices.inputs';

enum SortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  LAST_SCRAPED_AT = 'lastScrapedAt',
}

registerEnumType(SortField, {
  name: 'SortField',
});

@InputType()
export class ProductDetailsInput {
  @Field(() => String)
  @IsString()
  @MinLength(5)
  name: string;

  @Field(() => String)
  @IsUrl()
  @IsString()
  image: string;

  @Field(() => String)
  @IsString()
  @MinLength(10)
  ean: string;

  @Field(() => String)
  @IsString()
  url: string;
}

@InputType()
export class CreateProductInput {
  @Field(() => ProductDetailsInput)
  @ValidateNestedType(() => ProductDetailsInput)
  product: ProductDetailsInput;

  @Field(() => NoProductIdPriceInput)
  @ValidateNestedType(() => NoProductIdPriceInput)
  price: NoProductIdPriceInput;
}

@InputType()
export class GetProductsInput {
  @Field(() => SortField, { defaultValue: SortField.CREATED_AT })
  sortField?: SortField = SortField.CREATED_AT;

  @Field(() => SortOrder, { defaultValue: SortOrder.DESC })
  sortOrder?: SortOrder = SortOrder.DESC;
}

@InputType()
export class GetProductsLiteInput {
  @Field(() => String)
  term?: string;
}

@InputType()
export class GetPriceHistoryInput {
  @Field(() => String)
  productId: string;

  @Field(() => Store, { nullable: true })
  @IsEnum(Store)
  @IsOptional()
  store?: Store;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;
}
