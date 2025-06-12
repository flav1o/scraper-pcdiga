import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

@InputType()
export class AddOnWatch {
  @Field(() => String)
  productId: string;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  targetPrice?: number;
}
