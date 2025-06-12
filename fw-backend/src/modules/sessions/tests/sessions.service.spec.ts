import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../thirdparty/prisma/prisma.service';
import { SessionsService } from '../sessions.service';

class MockPrismaService {
  session = {
    findUnique: jest.fn(),
    create: jest.fn(),
  };
  sessionVisits = {
    create: jest.fn(),
  };
}

describe('SessionsService', () => {
  let service: SessionsService;
  let prismaService: MockPrismaService;

  const mockSession = {
    sessionId: 'test-session-id',
    userId: 'test-user-id',
    createdAt: new Date(),
  };

  const mockSessionVisit = {
    visitId: 'test-visit-id',
    sessionId: 'test-session-id',
    productId: 'test-product-id',
    viewedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    prismaService = module.get(PrismaService);
  });

  describe('handleProductVisited', () => {
    const visitArgs = {
      userId: 'test-user-id',
      productId: 'test-product-id',
      sessionId: 'test-session-id',
    };

    it('should add product to existing session', async () => {
      prismaService.session.findUnique.mockResolvedValue(mockSession);
      prismaService.sessionVisits.create.mockResolvedValue(mockSessionVisit);

      await service.handleProductVisited(visitArgs);

      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { sessionId: visitArgs.sessionId },
      });
      expect(prismaService.sessionVisits.create).toHaveBeenCalledWith({
        data: {
          sessionId: visitArgs.sessionId,
          productId: visitArgs.productId,
        },
      });
    });

    it('should create new session and add product when session does not exist', async () => {
      prismaService.session.findUnique.mockResolvedValue(null);
      prismaService.session.create.mockResolvedValue(mockSession);
      prismaService.sessionVisits.create.mockResolvedValue(mockSessionVisit);

      await service.handleProductVisited({
        userId: visitArgs.userId,
        productId: visitArgs.productId,
      });

      expect(prismaService.session.create).toHaveBeenCalledWith({
        data: { userId: visitArgs.userId },
      });
      expect(prismaService.sessionVisits.create).toHaveBeenCalledWith({
        data: {
          sessionId: mockSession.sessionId,
          productId: visitArgs.productId,
        },
      });
    });
  });

  describe('getSession', () => {
    it('should return session when found', async () => {
      prismaService.session.findUnique.mockResolvedValue(mockSession);

      const result = await service.getSession('test-session-id');

      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { sessionId: 'test-session-id' },
      });
      expect(result).toEqual(mockSession);
    });

    it('should return null when session not found', async () => {
      prismaService.session.findUnique.mockResolvedValue(null);

      const result = await service.getSession('nonexistent-session-id');

      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { sessionId: 'nonexistent-session-id' },
      });
      expect(result).toBeNull();
    });
  });

  describe('generateSession', () => {
    it('should create and return a new session', async () => {
      prismaService.session.create.mockResolvedValue(mockSession);

      const result = await service.generateSession('test-user-id');

      expect(prismaService.session.create).toHaveBeenCalledWith({
        data: { userId: 'test-user-id' },
      });
      expect(result).toEqual(mockSession);
    });
  });

  describe('addProductToSession', () => {
    it('should create a session visit', async () => {
      prismaService.sessionVisits.create.mockResolvedValue(mockSessionVisit);

      const result = await service.addProductToSession(
        'test-session-id',
        'test-product-id',
      );

      expect(prismaService.sessionVisits.create).toHaveBeenCalledWith({
        data: {
          sessionId: 'test-session-id',
          productId: 'test-product-id',
        },
      });
      expect(result).toEqual(mockSessionVisit);
    });
  });
});
