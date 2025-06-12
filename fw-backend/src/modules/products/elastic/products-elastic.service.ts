import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from 'src/modules/thirdparty/elasticsearch/elasticsearch.service';
import { AvailableIndexes } from 'src/modules/thirdparty/elasticsearch/types';
import { GetProductsLiteInput } from '../gql/types/products.inputs';
import { ProductLite } from '../gql/types/products.outputs';
import { ProductElastic } from './products-elastic.types';

@Injectable()
export class ProductsElasticService {
  constructor(private readonly esService: ElasticsearchService) {}

  async createProduct(product: ProductElastic): Promise<ProductElastic> {
    const document = await this.esService.indexDocument<ProductElastic>(
      AvailableIndexes.Products,
      product,
    );

    if (document.body.result === 'created') {
      return product;
    }

    throw new HttpException(
      'products.could_not_index',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async getProducts(filters: GetProductsLiteInput): Promise<ProductLite[]> {
    const rawProducts = await this.esService.findDocs<ProductLite>(
      AvailableIndexes.Products,
      {
        term: filters.term,
      },
    );

    const products = rawProducts.body.hits.hits.map(
      (product) => product._source,
    );

    return products;
  }

  async createManyProducts(
    products: ProductElastic[],
  ): Promise<ProductElastic[]> {
    const documents = await this.esService.bulkIndexDocuments<ProductElastic>(
      AvailableIndexes.Products,
      products,
    );

    const createdProducts = documents.body.items.map((item) => {
      if (item.create.result === 'created') {
        return item.create._source;
      }
    });

    return createdProducts;
  }
}
