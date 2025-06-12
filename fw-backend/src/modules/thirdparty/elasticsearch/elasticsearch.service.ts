import { Client } from '@elastic/elasticsearch';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ELASTICSEARCH_CONFIG } from './elasticsearch.constants';
import { indexSettingsMapper } from './settings/mapper';
import {
  AvailableIndexes,
  ElasticDocById,
  ElasticNewDocument,
  ElasticsearchConfig,
  Match,
} from './types';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly client: Client;

  constructor(
    @Inject(ELASTICSEARCH_CONFIG)
    private readonly config: ElasticsearchConfig,
  ) {
    this.client = new Client({
      node: 'http://localhost:9200',
    });
  }

  async onModuleInit() {
    const indexes = Object.values(AvailableIndexes);
    indexes.forEach(async (index) => await this.createIndex(index));
  }

  getClient(): Client {
    return this.client;
  }

  async indexDocument<T>(
    index: AvailableIndexes,
    document: T,
  ): Promise<ElasticNewDocument> {
    return await this.client.index({
      index,
      body: document,
    });
  }

  async findDocById<T>(
    index: string,
    match: Match,
  ): Promise<ElasticDocById<T>> {
    return await this.client.search({
      index,
      body: {
        query: {
          match,
        },
      },
    });
  }

  async findDocs<T>(index: string, match: any): Promise<ElasticDocById<T>> {
    return await this.client.search({
      index,
      body: {
        query: {
          match: {
            name: {
              query: match.term,
              analyzer: 'trigram_analyzer',
            },
          },
        },
      },
    });
  }

  async createIndex(index: AvailableIndexes): Promise<void> {
    const exists = await this.client.indices.exists({ index });

    if (exists.statusCode === 200) {
      return;
    }

    await this.client.indices.create({
      index,
      body: indexSettingsMapper[index],
    });
  }

  async bulkIndexDocuments<T>(
    index: AvailableIndexes,
    documents: T[],
  ): Promise<any> {
    const body = documents.flatMap((doc) => [
      { index: { _index: index } },
      doc,
    ]);

    return await this.client.bulk({ refresh: true, body });
  }
}
