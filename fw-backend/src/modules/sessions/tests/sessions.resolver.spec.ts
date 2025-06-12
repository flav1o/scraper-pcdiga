import { Test, TestingModule } from '@nestjs/testing';
import { CurrUser } from '../../auth/types';
import { SessionsResolver } from '../gql/sessions.resolver';
import { SessionsService } from '../sessions.service';

class MockSessionsService {
  generateSession = jest.fn();
}

describe('SessionsResolver', () => {
  let resolver: SessionsResolver;
  let sessionsService: MockSessionsService;

  const mockUser: CurrUser = {
    userId: 'test-user-id',
    email: 'test@example.com',
  };

  const mockSession = {
    sessionId: 'test-session-id',
    userId: 'test-user-id',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsResolver,
        {
          provide: SessionsService,
          useClass: MockSessionsService,
        },
      ],
    }).compile();

    resolver = module.get<SessionsResolver>(SessionsResolver);
    sessionsService = module.get(SessionsService);
  });

  describe('generateSession', () => {
    it('should generate a new session and return its ID', async () => {
      sessionsService.generateSession.mockResolvedValue(mockSession);

      const result = await resolver.generateSession(mockUser);

      expect(sessionsService.generateSession).toHaveBeenCalledWith(
        mockUser.userId,
      );
      expect(result).toBe(mockSession.sessionId);
    });
  });
});
