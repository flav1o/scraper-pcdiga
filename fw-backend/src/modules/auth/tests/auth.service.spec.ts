import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';

class MockJwtService {
  signAsync = jest.fn();
}

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: MockJwtService;

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockToken = 'mock.jwt.token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signToken', () => {
    it('should sign a JWT token with user data', async () => {
      jwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signToken(mockUser);

      expect(jwtService.signAsync).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(mockToken);
    });

    it('should propagate errors from JWT signing', async () => {
      const error = new Error('JWT signing failed');
      jwtService.signAsync.mockRejectedValue(error);

      await expect(service.signToken(mockUser)).rejects.toThrow(error);
    });

    it('should handle empty user data', async () => {
      const invalidUser = { id: '', email: '' };
      jwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signToken(invalidUser);

      expect(jwtService.signAsync).toHaveBeenCalledWith(invalidUser);
      expect(result).toBe(mockToken);
    });

    it('should pass through additional user data', async () => {
      const userWithExtra = { ...mockUser, role: 'admin' };
      jwtService.signAsync.mockResolvedValue(mockToken);

      await service.signToken(userWithExtra as any);

      expect(jwtService.signAsync).toHaveBeenCalledWith(userWithExtra);
    });
  });
});
