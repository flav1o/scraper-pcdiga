import { faker } from '@faker-js/faker';
import { Store } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../thirdparty/prisma/prisma.service';
import { ProductsElasticService } from './elastic/products-elastic.service';
import { CreateProductInput } from './gql/types/products.inputs';

export const _generateFakeData = async (
  prisma: PrismaService,
  productsElasticService: ProductsElasticService,
) => {
  const _products: {
    product: CreateProductInput['product'];
    price: CreateProductInput['price'];
  }[] = [];

  for (let i = 0; i < 100_000; i++) {
    const originalPrice = +faker.commerce.price();
    const hasDiscount = Math.random() < 0.3;
    const discount = hasDiscount ? originalPrice * (Math.random() / 100) : 0;

    _products.push({
      product: {
        ean: `${faker.commerce.isbn()}${faker.commerce.isbn()}`,
        image: faker.image.urlPicsumPhotos(),
        name: faker.commerce.productName(),
        url: faker.internet.url(),
      },
      price: {
        originalPrice,
        discountPrice: hasDiscount ? originalPrice - discount : null,
        store: Store.PC_DIGA,
      },
    });
  }

  const insertedProducts = await prisma.product.createMany({
    data: _products.map(({ product }) => product),
    skipDuplicates: true,
  });

  const allProducts = await prisma.product.findMany({
    select: { productId: true, ean: true },
  });

  const productMap = new Map(allProducts.map((p) => [p.ean, p.productId]));

  await prisma.price.createMany({
    data: _products.map(({ product, price }) => ({
      ...price,
      productId: productMap.get(product.ean),
      scrapedById: randomUUID(),
      checksum: randomUUID(),
    })),
  });

  await productsElasticService.createManyProducts(
    _products.map(({ product }) => ({
      productId: productMap.get(product.ean),
      name: product.name,
      image: product.image,
    })),
  );

  return null;
};
