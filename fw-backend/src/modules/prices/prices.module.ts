import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '../thirdparty/elasticsearch/elasticsearch.module';
import { PricesService } from './prices.service';

@Module({
  providers: [PricesService],
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  exports: [PricesService],
})
export class PricesModule {}
