import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';
import { SortOrder } from 'src/common/types.gql';
import { genCheckSum } from 'src/utils/checksum';
import { PrismaService } from '../../thirdparty/prisma/prisma.service';
import { ProductsElasticService } from '../elastic/products-elastic.service';
import { CreateProductInput } from '../gql/types/products.inputs';
import { ProductService } from '../products.service';

jest.mock('src/utils/checksum');

class MockPrismaService {
  product = {
    upsert: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
  };
}

class MockProductsElasticService {
  createProduct = jest.fn();
  getProducts = jest.fn();
}

describe('ProductService', () => {
  let service: ProductService;
  let prismaService: MockPrismaService;
  let elasticService: MockProductsElasticService;

  const mockProduct = {
    productId: 'test-product-id',
    ean: '1234567890',
    name: 'Test Product',
    image: 'test.jpg',
    url: 'http://test.com',
    lastScrapedAt: new Date(),
    createdAt: new Date(),
  };

  const mockPrice = {
    priceId: 'test-price-id',
    productId: 'test-product-id',
    originalPrice: 100,
    discountPrice: null,
    createdAt: new Date(),
    hasDiscount: false,
    scrapedById: 'test-user-id',
    checksum: 'test-checksum',
    store: 'PC_DIGA' as const,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
        {
          provide: ProductsElasticService,
          useClass: MockProductsElasticService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get(PrismaService);
    elasticService = module.get(ProductsElasticService);
  });

  describe('createOrUpsertProduct', () => {
    const productInput = {
      name: 'Test Product',
      image: 'test.jpg',
      ean: '1234567890',
      url: 'http://test.com',
    };

    it('should create a new product', async () => {
      const date = dayjs().toISOString();
      const mockProductWithPrices = {
        ...mockProduct,
        prices: [],
        createdAt: new Date(date),
        lastScrapedAt: new Date(date),
      };
      prismaService.product.upsert.mockResolvedValue(mockProductWithPrices);

      const result = await service.createOrUpsertProduct(productInput);

      expect(prismaService.product.upsert).toHaveBeenCalledWith({
        create: expect.objectContaining({
          ...productInput,
          lastScrapedAt: expect.any(String),
          createdAt: expect.any(String),
        }),
        update: {
          lastScrapedAt: expect.any(String),
        },
        where: {
          ean: productInput.ean,
        },
        include: {
          prices: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      expect(result).toEqual({
        data: mockProductWithPrices,
        wasCreateAction: true,
        lastPrice: undefined,
      });
    });

    it('should update an existing product', async () => {
      const oldDate = dayjs().subtract(1, 'day').toISOString();
      const mockProductWithPrices = {
        ...mockProduct,
        createdAt: new Date(oldDate),
        prices: [mockPrice],
      };
      prismaService.product.upsert.mockResolvedValue(mockProductWithPrices);

      const result = await service.createOrUpsertProduct(productInput);

      expect(result).toEqual({
        data: mockProductWithPrices,
        wasCreateAction: false,
        lastPrice: mockPrice,
      });
    });
  });

  describe('getProducts', () => {
    it('should return products with history using default pagination', async () => {
      const mockProducts = [{ ...mockProduct, prices: [mockPrice] }];
      prismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.getProducts({}, {});

      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: {
          prices: {
            where: {
              createdAt: {
                gte: expect.any(String),
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual(
        mockProducts.map(({ prices, ...product }) => ({
          prices,
          product,
        })),
      );
    });

    it('should use provided pagination and sorting', async () => {
      const mockProducts = [{ ...mockProduct, prices: [mockPrice] }];
      prismaService.product.findMany.mockResolvedValue(mockProducts);

      await service.getProducts(
        { sortOrder: SortOrder.ASC },
        { skip: 1, total: 20 },
      );

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 20,
          orderBy: {
            createdAt: SortOrder.ASC,
          },
        }),
      );
    });
  });

  describe('getProduct', () => {
    it('should return product by ID or EAN', async () => {
      prismaService.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.getProduct('test-product-id');

      expect(prismaService.product.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ productId: 'test-product-id' }, { ean: 'test-product-id' }],
          lastScrapedAt: {
            gte: expect.any(String),
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('validateChecksum', () => {
    const input: CreateProductInput = {
      product: {
        name: 'Test Product',
        image: 'test.jpg',
        ean: '1234567890',
        url: 'http://test.com',
      },
      price: {
        originalPrice: 100,
        discountPrice: null,
        store: 'PC_DIGA',
      },
    };

    it('should validate matching checksums', () => {
      (genCheckSum as jest.Mock).mockReturnValue('valid-checksum');

      expect(() =>
        service.validateChecksum(input, 'valid-checksum'),
      ).not.toThrow();
    });

    it('should throw error for mismatched checksums', () => {
      (genCheckSum as jest.Mock).mockReturnValue('valid-checksum');

      expect(() => service.validateChecksum(input, 'invalid-checksum')).toThrow(
        HttpException,
      );
    });
  });
});
