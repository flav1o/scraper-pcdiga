import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from 'src/graphql/graphql-schema';
import { ENTITIES_KEY } from 'src/shared';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ENTITIES_KEY.PRODUCTS_MODEL)
    private productModel: Model<Product>,
  ) {}

  async createProduct(input: CreateProductInput): Promise<Product> {
    const newProduct = new this.productModel({ ...input });

    return await newProduct.save();
  }

  async getProduct(ean?: string, url?: string): Promise<Product> {
    if (ean) return await this.productModel.findOne({ ean });
    if (url) return await this.productModel.findOne({ url });

    throw new HttpException(
      'PRODUCT.PRODUCT_DOES_NOT_EXIST',
      HttpStatus.NOT_FOUND,
    );
  }

  async updateProduct(
    ean: string,
    input: UpdateProductInput,
  ): Promise<Product> {
    const problem = await this.productModel.findOneAndUpdate(
      {
        ean,
      },
      {
        $set: {
          ...input,
        },
      },
      { new: true },
    );

    if (!problem)
      throw new HttpException(
        'PROBLEM.PROBLEM_DOESNT_EXIST',
        HttpStatus.NOT_FOUND,
      );

    return problem;
  }
}
