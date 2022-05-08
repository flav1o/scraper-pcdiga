import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';
import { ENTITIES_KEY } from 'src/shared';
import { AutosearchService } from './autosearch.service';
import { AutosearchResolver } from './gql/autosearch.resolver';
import { AutoSearchSchema } from './products.model';

@Module({
  providers: [AutosearchResolver, AutosearchService],
  imports: [
    MongooseModule.forFeature([
      { name: ENTITIES_KEY.AUTO_SEARCH_MODEL, schema: AutoSearchSchema },
    ]),
    ProductsModule,
  ],
})
export class AutosearchModule {}
