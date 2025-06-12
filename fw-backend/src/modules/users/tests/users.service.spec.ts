import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../thirdparty/prisma/prisma.service';
import { UsersService } from '../users.service';

jest.mock('bcrypt');

class MockPrismaService {
  user = {
    create: jest.fn(),
    findUnique: jest.fn(),
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: MockPrismaService;

  const mockUser = {
    userId: 'test-user-id',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    socialAuth: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);

    // Mock bcrypt functions
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt123');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const createUserInput = {
        email: 'test@example.com',
        password: 'password123',
        username: 'Test User',
      };

      prismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserInput);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt123');
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserInput.email,
          password: 'hashedPassword123',
          name: createUserInput.username,
          socialAuth: undefined,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should create a user with social auth', async () => {
      const createUserInput = {
        email: 'test@example.com',
        password: 'password123',
        username: 'Test User',
        socialAuth: true,
      };

      const socialAuthUser = { ...mockUser, socialAuth: true };
      prismaService.user.create.mockResolvedValue(socialAuthUser);

      const result = await service.createUser(createUserInput);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserInput.email,
          password: 'hashedPassword123',
          name: createUserInput.username,
          socialAuth: true,
        },
      });
      expect(result).toEqual(socialAuthUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user when found by email', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserByEmail('nonexistent@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return a user when found by id', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById('test-user-id');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userId: 'test-user-id' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by id', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserById('nonexistent-id');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userId: 'nonexistent-id' },
      });
      expect(result).toBeNull();
    });
  });
});
