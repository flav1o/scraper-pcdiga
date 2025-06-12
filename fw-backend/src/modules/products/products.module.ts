import { Module } from '@nestjs/common';
import { PricesModule } from '../prices/prices.module';
import { ElasticsearchModule } from '../thirdparty/elasticsearch/elasticsearch.module';
import { ProductsElasticService } from './elastic/products-elastic.service';
import { ProductResolver } from './gql/products.resolver';
import { ProductService } from './products.service';
@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
    PricesModule,
  ],
  providers: [ProductResolver, ProductService, ProductsElasticService],
  exports: [ProductService],
})
export class ProductsModule {}
