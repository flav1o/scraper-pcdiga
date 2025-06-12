import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '../../thirdparty/mailer/mailer.service';
import { PrismaService } from '../../thirdparty/prisma/prisma.service';
import { RabbitMqService } from '../../thirdparty/rabbitmq/rabbitmq.service';
import { OnWatchService } from '../on-watch.service';

// Create a mock class for PrismaService
class MockPrismaService {
  product = {
    count: jest.fn(),
    findMany: jest.fn(),
  };
  onWatch = {
    upsert: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  };
}

describe('OnWatchService', () => {
  let service: OnWatchService;
  let prismaService: MockPrismaService;
  let rabbitMqService: jest.Mocked<RabbitMqService>;

  const mockProduct = {
    productId: 'test-product-id',
    url: 'http://test.com',
    name: 'Test Product',
    image: 'test.jpg',
    ean: '1234567890',
    lastScrapedAt: new Date(),
    createdAt: new Date(),
  };

  const mockOnWatch = {
    watchId: 'test-watch-id',
    userId: 'test-user-id',
    productId: 'test-product-id',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnWatchService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
        {
          provide: RabbitMqService,
          useValue: {
            addProductToQueue: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OnWatchService>(OnWatchService);
    prismaService = module.get(PrismaService);
    rabbitMqService = module.get(RabbitMqService);
  });

  describe('_handleCron', () => {
    it('should process products in batches and add them to queue', async () => {
      const mockProducts = [mockProduct];
      prismaService.product.count.mockResolvedValue(1);
      prismaService.product.findMany.mockResolvedValue(mockProducts);
      rabbitMqService.addProductToQueue.mockResolvedValue(undefined);

      // @ts-expect-error - accessing private method for testing
      await service._handleCron();

      expect(prismaService.product.count).toHaveBeenCalled();
      expect(prismaService.product.findMany).toHaveBeenCalled();
      expect(rabbitMqService.addProductToQueue).toHaveBeenCalledWith({
        productId: mockProduct.productId,
        url: mockProduct.url,
        company: 'PC_DIGA',
      });
    });
  });

  describe('addOnWatch', () => {
    it('should add product to watch list', async () => {
      prismaService.onWatch.upsert.mockResolvedValue(mockOnWatch);

      const result = await service.addOnWatch(
        mockProduct.productId,
        mockOnWatch.userId,
      );

      expect(prismaService.onWatch.upsert).toHaveBeenCalledWith({
        create: {
          userId: mockOnWatch.userId,
          productId: mockProduct.productId,
          targetPrice: undefined,
        },
        update: {
          targetPrice: undefined,
        },
        where: {
          productId_userId: {
            productId: mockProduct.productId,
            userId: mockOnWatch.userId,
          },
        },
      });
      expect(result).toEqual(mockOnWatch);
    });

    it('should add product to watch list with target price', async () => {
      const targetPrice = 99.99;
      prismaService.onWatch.upsert.mockResolvedValue({
        ...mockOnWatch,
        targetPrice,
      });

      const result = await service.addOnWatch(
        mockProduct.productId,
        mockOnWatch.userId,
        targetPrice,
      );

      expect(prismaService.onWatch.upsert).toHaveBeenCalledWith({
        create: {
          userId: mockOnWatch.userId,
          productId: mockProduct.productId,
          targetPrice,
        },
        update: {
          targetPrice,
        },
        where: {
          productId_userId: {
            productId: mockProduct.productId,
            userId: mockOnWatch.userId,
          },
        },
      });
      expect(result).toEqual({
        ...mockOnWatch,
        targetPrice,
      });
    });
  });

  describe('getOnWatchByUser', () => {
    it('should return user watch list with products and prices', async () => {
      const mockWatchList = [
        {
          ...mockOnWatch,
          targetPrice: null,
          product: {
            ...mockProduct,
            prices: [],
          },
        },
      ];

      prismaService.onWatch.findMany.mockResolvedValue(mockWatchList);

      const result = await service.getOnWatchByUser(mockOnWatch.userId);

      expect(prismaService.onWatch.findMany).toHaveBeenCalledWith({
        where: { userId: mockOnWatch.userId },
        include: {
          product: {
            include: {
              prices: {
                where: {
                  createdAt: {
                    gte: expect.any(Date),
                  },
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(
        mockWatchList.map(({ watchId, product, targetPrice }) => ({
          watchId,
          product,
          targetPrice: targetPrice ? Number(targetPrice) : null,
        })),
      );
    });
  });

  describe('isProductOnUserWatchList', () => {
    it('should return true when product is on watch list', async () => {
      prismaService.onWatch.findFirst.mockResolvedValue(mockOnWatch);

      const result = await service.isProductOnUserWatchList(
        mockProduct.productId,
        mockOnWatch.userId,
      );

      expect(prismaService.onWatch.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockOnWatch.userId,
          productId: mockProduct.productId,
        },
      });
      expect(result).toEqual(mockOnWatch);
    });

    it('should return null when product is not on watch list', async () => {
      prismaService.onWatch.findFirst.mockResolvedValue(null);

      const result = await service.isProductOnUserWatchList(
        mockProduct.productId,
        mockOnWatch.userId,
      );

      expect(result).toBeNull();
    });
  });
});
