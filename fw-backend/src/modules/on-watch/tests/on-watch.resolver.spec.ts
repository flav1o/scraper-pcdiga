import { HttpException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrUser } from '../../auth/types';
import { ProductService } from '../../products/products.service';
import { RabbitMqService } from '../../thirdparty/rabbitmq/rabbitmq.service';
import { OnWatchResolver } from '../gql/on-watch.resolver';
import { OnWatchService } from '../on-watch.service';

// Create mock classes
class MockOnWatchService {
  addOnWatch = jest.fn();
  getOnWatchByUser = jest.fn();
  isProductOnUserWatchList = jest.fn();
}

class MockProductService {
  getProduct = jest.fn();
}

describe('OnWatchResolver', () => {
  let resolver: OnWatchResolver;
  let onWatchService: MockOnWatchService;
  let productService: MockProductService;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const mockProduct = {
    productId: 'test-product-id',
    url: 'http://test.com',
    name: 'Test Product',
    image: 'test.jpg',
    ean: '1234567890',
    lastScrapedAt: new Date(),
    createdAt: new Date(),
  };

  const mockUser: CurrUser = {
    userId: 'test-user-id',
    email: 'test@example.com',
  };

  const mockOnWatch = {
    watchId: 'test-watch-id',
    userId: mockUser.userId,
    productId: mockProduct.productId,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnWatchResolver,
        {
          provide: OnWatchService,
          useClass: MockOnWatchService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: RabbitMqService,
          useValue: {
            addProductToQueue: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<OnWatchResolver>(OnWatchResolver);
    onWatchService = module.get(OnWatchService);
    productService = module.get(ProductService);
    eventEmitter = module.get(EventEmitter2);
  });

  describe('addOnWatch', () => {
    it('should add product to watch list and emit event', async () => {
      productService.getProduct.mockResolvedValue(mockProduct);
      onWatchService.addOnWatch.mockResolvedValue(mockOnWatch);
      eventEmitter.emit.mockReturnValue(true);

      const result = await resolver.addOnWatch(
        { productId: mockProduct.productId },
        mockUser,
      );

      expect(productService.getProduct).toHaveBeenCalledWith(
        mockProduct.productId,
      );
      expect(onWatchService.addOnWatch).toHaveBeenCalledWith(
        mockProduct.productId,
        mockUser.userId,
        undefined,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith('on_watch.scrape', {
        userId: mockUser.userId,
        productId: mockProduct.productId,
        url: mockProduct.url,
        company: 'PC_DIGA',
      });
      expect(result).toEqual({
        success: true,
        message: 'on_watch.product_added',
      });
    });

    it('should add product to watch list with target price and emit event', async () => {
      const targetPrice = 99.99;
      productService.getProduct.mockResolvedValue(mockProduct);
      onWatchService.addOnWatch.mockResolvedValue(mockOnWatch);
      eventEmitter.emit.mockReturnValue(true);

      const result = await resolver.addOnWatch(
        { productId: mockProduct.productId, targetPrice },
        mockUser,
      );

      expect(productService.getProduct).toHaveBeenCalledWith(
        mockProduct.productId,
      );
      expect(onWatchService.addOnWatch).toHaveBeenCalledWith(
        mockProduct.productId,
        mockUser.userId,
        targetPrice,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith('on_watch.scrape', {
        userId: mockUser.userId,
        productId: mockProduct.productId,
        url: mockProduct.url,
        company: 'PC_DIGA',
      });
      expect(result).toEqual({
        success: true,
        message: 'on_watch.product_added',
      });
    });

    it('should throw error when product not found', async () => {
      productService.getProduct.mockResolvedValue(null);

      await expect(
        resolver.addOnWatch({ productId: 'invalid-id' }, mockUser),
      ).rejects.toThrow(HttpException);
    });

    it('should throw error when adding to watch list fails', async () => {
      productService.getProduct.mockResolvedValue(mockProduct);
      onWatchService.addOnWatch.mockResolvedValue(null);

      await expect(
        resolver.addOnWatch({ productId: mockProduct.productId }, mockUser),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('myWatchList', () => {
    it('should return user watch list', async () => {
      const mockWatchList = [
        {
          watchId: mockOnWatch.watchId,
          product: {
            ...mockProduct,
            prices: [],
          },
        },
      ];

      onWatchService.getOnWatchByUser.mockResolvedValue(mockWatchList);

      const result = await resolver.myWatchList(mockUser);

      expect(onWatchService.getOnWatchByUser).toHaveBeenCalledWith(
        mockUser.userId,
      );
      expect(result).toEqual(mockWatchList);
    });
  });

  describe('checkIsOnWatch', () => {
    it('should return true when product is on watch list', async () => {
      onWatchService.isProductOnUserWatchList.mockResolvedValue(mockOnWatch);

      const result = await resolver.checkIsOnWatch(
        mockProduct.productId,
        mockUser,
      );

      expect(onWatchService.isProductOnUserWatchList).toHaveBeenCalledWith(
        mockProduct.productId,
        mockUser.userId,
      );
      expect(result).toBe(true);
    });

    it('should return false when product is not on watch list', async () => {
      onWatchService.isProductOnUserWatchList.mockResolvedValue(null);

      const result = await resolver.checkIsOnWatch(
        mockProduct.productId,
        mockUser,
      );

      expect(result).toBe(false);
    });
  });
});
