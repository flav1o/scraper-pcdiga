import { HttpException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';
import { SortOrder } from 'src/common/types.gql';
import { CurrUser } from '../../auth/types';
import { PricesService } from '../../prices/prices.service';
import { PrismaService } from '../../thirdparty/prisma/prisma.service';
import { ProductsElasticService } from '../elastic/products-elastic.service';
import { ProductResolver } from '../gql/products.resolver';
import {
  CreateProductInput,
  GetProductsInput,
} from '../gql/types/products.inputs';
import { PriceOpportunityClassification } from '../gql/types/products.outputs';
import { ProductService } from '../products.service';

class MockProductService {
  createOrUpsertProduct = jest.fn();
  getProduct = jest.fn();
  getProducts = jest.fn();
  validateChecksum = jest.fn();
}

class MockPricesService {
  createProductPrice = jest.fn();
  getProductPrices = jest.fn();
  getAllProductPricesHistory = jest.fn();
}

class MockProductsElasticService {
  createProduct = jest.fn();
  getProducts = jest.fn();
}

class MockPrismaService {
  // Add any necessary mock methods
}

describe('ProductResolver', () => {
  let resolver: ProductResolver;
  let productService: MockProductService;
  let pricesService: MockPricesService;
  let elasticService: MockProductsElasticService;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const mockUser: CurrUser = {
    userId: 'test-user-id',
    email: 'test@example.com',
  };

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
        ProductResolver,
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: PricesService,
          useClass: MockPricesService,
        },
        {
          provide: ProductsElasticService,
          useClass: MockProductsElasticService,
        },
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ProductResolver>(ProductResolver);
    productService = module.get(ProductService);
    pricesService = module.get(PricesService);
    elasticService = module.get(ProductsElasticService);
    eventEmitter = module.get(EventEmitter2);
  });

  describe('upsertProduct', () => {
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

    it('should create/update product and handle new price', async () => {
      productService.createOrUpsertProduct.mockResolvedValue({
        data: mockProduct,
        wasCreateAction: true,
        lastPrice: null,
      });
      elasticService.createProduct.mockResolvedValue(undefined);
      pricesService.createProductPrice.mockResolvedValue(mockPrice);

      const result = await resolver.upsertProduct(
        input,
        'test-session-id',
        mockUser,
        'valid-checksum',
      );

      expect(productService.validateChecksum).toHaveBeenCalledWith(
        input,
        'valid-checksum',
      );
      expect(productService.createOrUpsertProduct).toHaveBeenCalledWith(
        input.product,
      );
      expect(elasticService.createProduct).toHaveBeenCalledWith(mockProduct);
      expect(pricesService.createProductPrice).toHaveBeenCalledWith(
        { productId: mockProduct.productId, ...input.price },
        mockUser.userId,
        'valid-checksum',
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith('product.visited', {
        userId: mockUser.userId,
        productId: mockProduct.productId,
        sessionId: 'test-session-id',
      });
      expect(result).toEqual(mockProduct);
    });

    it('should not create new price if recent price exists', async () => {
      const recentPrice = {
        ...mockPrice,
        createdAt: dayjs().subtract(1, 'hour').toDate(),
      };
      productService.createOrUpsertProduct.mockResolvedValue({
        data: mockProduct,
        wasCreateAction: false,
        lastPrice: recentPrice,
      });

      await resolver.upsertProduct(
        input,
        'test-session-id',
        mockUser,
        'valid-checksum',
      );

      expect(pricesService.createProductPrice).not.toHaveBeenCalled();
    });
  });

  describe('product', () => {
    it('should return product with prices', async () => {
      productService.getProduct.mockResolvedValue(mockProduct);
      pricesService.getProductPrices.mockResolvedValue([mockPrice]);

      const result = await resolver.product('test-product-id');

      expect(productService.getProduct).toHaveBeenCalledWith('test-product-id');
      expect(pricesService.getProductPrices).toHaveBeenCalledWith(
        mockProduct.productId,
      );
      expect(result).toEqual({
        product: mockProduct,
        prices: [mockPrice],
      });
    });

    it('should throw error when product not found', async () => {
      productService.getProduct.mockResolvedValue(null);

      await expect(resolver.product('nonexistent-id')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('productsLite', () => {
    it('should return lite products list', async () => {
      const filters = { term: 'test' };
      const mockLiteProducts = [
        {
          productId: mockProduct.productId,
          name: mockProduct.name,
          image: mockProduct.image,
        },
      ];
      elasticService.getProducts.mockResolvedValue(mockLiteProducts);

      const result = await resolver.productsLite(filters);

      expect(elasticService.getProducts).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockLiteProducts);
    });
  });

  describe('products', () => {
    it('should return products with history', async () => {
      const filters: GetProductsInput = { sortOrder: SortOrder.DESC };
      const list = { skip: 0, total: 10 };
      const mockProductsWithHistory = [
        {
          product: mockProduct,
          prices: [mockPrice],
        },
      ];
      productService.getProducts.mockResolvedValue(mockProductsWithHistory);

      const result = await resolver.products(filters, list);

      expect(productService.getProducts).toHaveBeenCalledWith(filters, list);
      expect(result).toEqual(mockProductsWithHistory);
    });
  });

  describe('evaluatePriceOpportunity', () => {
    const mockPriceHistory = [
      { originalPrice: 50, discountPrice: null, createdAt: new Date() }, // Current: 50 (most recent)
      { originalPrice: 80, discountPrice: null, createdAt: new Date() }, // 80
      { originalPrice: 100, discountPrice: null, createdAt: new Date() }, // 100
      { originalPrice: 90, discountPrice: null, createdAt: new Date() }, // 90
      { originalPrice: 60, discountPrice: null, createdAt: new Date() }, // 60
      { originalPrice: 70, discountPrice: null, createdAt: new Date() }, // 70
      { originalPrice: 110, discountPrice: null, createdAt: new Date() }, // 110
      { originalPrice: 85, discountPrice: null, createdAt: new Date() }, // 85
      { originalPrice: 95, discountPrice: null, createdAt: new Date() }, // 95
      { originalPrice: 75, discountPrice: null, createdAt: new Date() }, // 75
    ];

    it('should classify current price as "Excelente" when in bottom 10%', async () => {
      pricesService.getAllProductPricesHistory.mockResolvedValue(
        mockPriceHistory,
      );

      const result = await resolver.evaluatePriceOpportunity('test-product-id');

      expect(pricesService.getAllProductPricesHistory).toHaveBeenCalledWith(
        'test-product-id',
      );
      expect(result.classification).toBe(
        PriceOpportunityClassification.EXCELLENT,
      );
      expect(result.currentPrice).toBe(50);
      expect(result.currentOriginalPrice).toBe(50);
      expect(result.currentDiscountPrice).toBeNull();
      expect(result.hasCurrentDiscount).toBe(false);
      expect(result.minPrice).toBe(50);
      expect(result.maxPrice).toBe(110);
      expect(result.totalPriceRecords).toBe(10);
    });

    it('should classify current price as "Boa" when below average', async () => {
      const belowAveragePriceHistory = [
        { originalPrice: 85, discountPrice: null, createdAt: new Date() }, // Current: 85
        { originalPrice: 70, discountPrice: null, createdAt: new Date() }, // 70
        { originalPrice: 75, discountPrice: null, createdAt: new Date() }, // 75
        { originalPrice: 90, discountPrice: null, createdAt: new Date() }, // 90
        { originalPrice: 100, discountPrice: null, createdAt: new Date() }, // 100
        { originalPrice: 95, discountPrice: null, createdAt: new Date() }, // 95
        { originalPrice: 105, discountPrice: null, createdAt: new Date() }, // 105
        { originalPrice: 110, discountPrice: null, createdAt: new Date() }, // 110
        { originalPrice: 115, discountPrice: null, createdAt: new Date() }, // 115
        { originalPrice: 120, discountPrice: null, createdAt: new Date() }, // 120
      ];
      pricesService.getAllProductPricesHistory.mockResolvedValue(
        belowAveragePriceHistory,
      );

      const result = await resolver.evaluatePriceOpportunity('test-product-id');

      // Average = (85+70+75+90+100+95+105+110+115+120)/10 = 96.5
      // Current price (85) < average (96.5), so should be "Boa"
      // Sorted: [70,75,85,90,95,100,105,110,115,120] - percentile10Index = 1, threshold = 75
      // Since 85 > 75, it's not "Excelente", and since 85 < 96.5, it should be "Boa"
      expect(result.classification).toBe(PriceOpportunityClassification.GOOD);
      expect(result.currentPrice).toBe(85);
      expect(result.currentOriginalPrice).toBe(85);
      expect(result.currentDiscountPrice).toBeNull();
      expect(result.hasCurrentDiscount).toBe(false);
    });

    it('should handle discount prices correctly', async () => {
      const priceHistoryWithDiscounts = [
        { originalPrice: 100, discountPrice: 60, createdAt: new Date() }, // Current: 60 (discounted)
        { originalPrice: 80, discountPrice: null, createdAt: new Date() }, // 80 (no discount)
        { originalPrice: 90, discountPrice: 75, createdAt: new Date() }, // 75 (discounted)
        { originalPrice: 120, discountPrice: null, createdAt: new Date() }, // 120 (no discount)
      ];
      pricesService.getAllProductPricesHistory.mockResolvedValue(
        priceHistoryWithDiscounts,
      );

      const result = await resolver.evaluatePriceOpportunity('test-product-id');

      // Should use discount price (60) as current price, not original price (100)
      expect(result.currentPrice).toBe(60);
      expect(result.currentOriginalPrice).toBe(100);
      expect(result.currentDiscountPrice).toBe(60);
      expect(result.hasCurrentDiscount).toBe(true);
      // Average should be calculated from effective prices: (60 + 80 + 75 + 120) / 4 = 83.75
      expect(result.averagePrice).toBe(83.75);
      // Min should be 60 (the discounted current price)
      expect(result.minPrice).toBe(60);
      // Max should be 120 (original price without discount)
      expect(result.maxPrice).toBe(120);
    });

    it('should classify as "Normal" when current price is within 10% of average', async () => {
      const priceHistoryNormal = [
        { originalPrice: 100, discountPrice: null, createdAt: new Date() }, // Current: 100
        { originalPrice: 90, discountPrice: null, createdAt: new Date() }, // 90
        { originalPrice: 110, discountPrice: null, createdAt: new Date() }, // 110
      ];
      pricesService.getAllProductPricesHistory.mockResolvedValue(
        priceHistoryNormal,
      );

      const result = await resolver.evaluatePriceOpportunity('test-product-id');

      // Average = (100 + 90 + 110) / 3 = 100
      // Current price (100) equals average, so it should be "Normal"
      expect(result.classification).toBe(PriceOpportunityClassification.NORMAL);
      expect(result.currentPrice).toBe(100);
      expect(result.currentOriginalPrice).toBe(100);
      expect(result.currentDiscountPrice).toBeNull();
      expect(result.hasCurrentDiscount).toBe(false);
      expect(result.averagePrice).toBe(100);
    });

    it('should classify as "Alta" when current price is more than 10% above average', async () => {
      const priceHistoryHigh = [
        { originalPrice: 120, discountPrice: null, createdAt: new Date() }, // Current: 120
        { originalPrice: 80, discountPrice: null, createdAt: new Date() }, // 80
        { originalPrice: 90, discountPrice: null, createdAt: new Date() }, // 90
        { originalPrice: 85, discountPrice: null, createdAt: new Date() }, // 85
      ];
      pricesService.getAllProductPricesHistory.mockResolvedValue(
        priceHistoryHigh,
      );

      const result = await resolver.evaluatePriceOpportunity('test-product-id');

      // Average = (120 + 80 + 90 + 85) / 4 = 93.75
      // Current price (120) is significantly above average, so should be "Alta"
      expect(result.classification).toBe(PriceOpportunityClassification.HIGH);
      expect(result.currentPrice).toBe(120);
      expect(result.currentOriginalPrice).toBe(120);
      expect(result.currentDiscountPrice).toBeNull();
      expect(result.hasCurrentDiscount).toBe(false);
    });

    it('should provide detailed discount information when current price has discount', async () => {
      const discountedCurrentPrice = [
        { originalPrice: 150, discountPrice: 110, createdAt: new Date() }, // Current: 110 (discounted from 150)
        { originalPrice: 120, discountPrice: null, createdAt: new Date() }, // 120 (no discount)
        { originalPrice: 130, discountPrice: null, createdAt: new Date() }, // 130 (no discount)
        { originalPrice: 140, discountPrice: null, createdAt: new Date() }, // 140 (no discount)
        { originalPrice: 125, discountPrice: null, createdAt: new Date() }, // 125 (no discount)
        { originalPrice: 135, discountPrice: null, createdAt: new Date() }, // 135 (no discount)
        { originalPrice: 145, discountPrice: null, createdAt: new Date() }, // 145 (no discount)
        { originalPrice: 100, discountPrice: null, createdAt: new Date() }, // 100 (no discount)
        { originalPrice: 115, discountPrice: null, createdAt: new Date() }, // 115 (no discount)
        { originalPrice: 105, discountPrice: null, createdAt: new Date() }, // 105 (no discount)
      ];
      pricesService.getAllProductPricesHistory.mockResolvedValue(
        discountedCurrentPrice,
      );

      const result = await resolver.evaluatePriceOpportunity('test-product-id');

      // Verify detailed price information
      expect(result.currentPrice).toBe(110); // Effective price (discounted)
      expect(result.currentOriginalPrice).toBe(150); // Original price before discount
      expect(result.currentDiscountPrice).toBe(110); // Discounted price
      expect(result.hasCurrentDiscount).toBe(true); // Has discount flag

      // Effective prices: [110,120,130,140,125,135,145,100,115,105]
      // Average = 122.5, Current price (110) < average (122.5), so should be "Boa"
      // Sorted: [100,105,110,115,120,125,130,135,140,145] - 110 is not in bottom 10% (100)
      expect(result.classification).toBe(PriceOpportunityClassification.GOOD);
    });

    it('should throw error when no price history exists', async () => {
      pricesService.getAllProductPricesHistory.mockResolvedValue([]);

      await expect(
        resolver.evaluatePriceOpportunity('test-product-id'),
      ).rejects.toThrow(HttpException);
    });
  });
});
