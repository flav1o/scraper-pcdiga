import { DynamicModule, Module } from '@nestjs/common';
import { ELASTICSEARCH_CONFIG } from './elasticsearch.constants';
import { ElasticsearchService } from './elasticsearch.service';
import { ElasticsearchConfig } from './types';

@Module({})
export class ElasticsearchModule {
  static register(config: ElasticsearchConfig): DynamicModule {
    return {
      module: ElasticsearchModule,
      providers: [
        {
          provide: ELASTICSEARCH_CONFIG,
          useValue: config,
        },
        ElasticsearchService,
      ],
      exports: [ElasticsearchService],
    };
  }
}
