import {
  HttpHeaders,
  SearchResponse,
  WriteResponseBase,
} from '@elastic/elasticsearch/api/types';

export type ElasticDocById<T> = {
  body: SearchResponse<T>;
  statusCode: number;
  headers: HttpHeaders;
  meta?: Record<string, any>;
};

export type ElasticNewDocument = {
  body: WriteResponseBase;
  statusCode: number;
};

export interface ElasticsearchConfig {
  node: string;
  username?: string;
  password?: string;
  tls?: {
    rejectUnauthorized?: boolean;
  };
}

export type Match = { [key: string]: any };

export enum AvailableIndexes {
  'Products' = 'products',
}
