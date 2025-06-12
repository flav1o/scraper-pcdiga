import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../../strategies/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    const mockPayload = {
      id: 'test-user-id',
      email: 'test@example.com',
    };

    it('should validate and return the JWT payload', async () => {
      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        userId: mockPayload.id,
        email: mockPayload.email,
      });
    });

    it('should throw UnauthorizedException for invalid payload', async () => {
      const invalidPayload = {};

      await expect(strategy.validate(invalidPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for missing email', async () => {
      const payloadWithoutEmail = { id: 'test-user-id' };

      await expect(strategy.validate(payloadWithoutEmail)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for missing id', async () => {
      const payloadWithoutId = { email: 'test@example.com' };

      await expect(strategy.validate(payloadWithoutId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
