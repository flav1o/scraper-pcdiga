import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './gql/products.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './products.model';
import { ENTITIES_KEY } from 'src/shared';

@Module({
  providers: [ProductsResolver, ProductsService],
  imports: [
    MongooseModule.forFeature([
      { name: ENTITIES_KEY.PRODUCTS_MODEL, schema: ProductSchema },
    ]),
  ],
  controllers: [],
  exports: [ProductsService],
})
export class ProductsModule {}