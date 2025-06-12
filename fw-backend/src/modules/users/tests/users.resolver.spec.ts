import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth/auth.service';
import { GoogleAuthService } from '../../thirdparty/google-auth/google-auth.service';
import { UsersResolver } from '../gql/users.resolver';
import { UsersService } from '../users.service';

jest.mock('bcrypt');

// Create mock classes
class MockUsersService {
  createUser = jest.fn();
  getUserByEmail = jest.fn();
  getUserById = jest.fn();
}

class MockAuthService {
  signToken = jest.fn();
}

class MockGoogleAuthService {
  getUserPayload = jest.fn();
}

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: MockUsersService;
  let authService: MockAuthService;
  let googleAuthService: MockGoogleAuthService;

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
        UsersResolver,
        {
          provide: UsersService,
          useClass: MockUsersService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: GoogleAuthService,
          useClass: MockGoogleAuthService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get(UsersService);
    authService = module.get(AuthService);
    googleAuthService = module.get(GoogleAuthService);
  });

  describe('googleAuth', () => {
    const mockGooglePayload = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const mockAuthToken = 'mock-auth-token';

    beforeEach(() => {
      googleAuthService.getUserPayload.mockResolvedValue(mockGooglePayload);
      authService.signToken.mockResolvedValue(mockAuthToken);
    });

    it('should sign in existing user with Google', async () => {
      usersService.getUserByEmail.mockResolvedValue(mockUser);

      const result = await resolver.googleAuth('mock-google-code');

      expect(googleAuthService.getUserPayload).toHaveBeenCalledWith(
        'mock-google-code',
      );
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        mockGooglePayload.email,
      );
      expect(authService.signToken).toHaveBeenCalledWith({
        id: mockUser.userId,
        email: mockUser.email,
      });
      expect(result).toEqual({ authToken: mockAuthToken });
    });

    it('should create new user with Google auth', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      usersService.createUser.mockResolvedValue(mockUser);

      const result = await resolver.googleAuth('mock-google-code');

      expect(usersService.createUser).toHaveBeenCalledWith({
        email: mockGooglePayload.email,
        username: mockGooglePayload.name,
        password: 'SOCIAL_AUTH',
        socialAuth: true,
      });
      expect(authService.signToken).toHaveBeenCalledWith({
        id: mockUser.userId,
        email: mockUser.email,
      });
      expect(result).toEqual({ authToken: mockAuthToken });
    });
  });

  describe('signUp', () => {
    const signUpInput = {
      email: 'test@example.com',
      password: 'password123',
      username: 'Test User',
    };

    it('should create a new user', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);
      usersService.createUser.mockResolvedValue(mockUser);

      const result = await resolver.signUp(signUpInput);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        signUpInput.email,
      );
      expect(usersService.createUser).toHaveBeenCalledWith(signUpInput);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if email already exists', async () => {
      usersService.getUserByEmail.mockResolvedValue(mockUser);

      await expect(resolver.signUp(signUpInput)).rejects.toThrow(HttpException);
    });
  });

  describe('signIn', () => {
    const signInInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    beforeEach(() => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      authService.signToken.mockResolvedValue('mock-auth-token');
    });

    it('should sign in user with valid credentials', async () => {
      usersService.getUserByEmail.mockResolvedValue(mockUser);

      const result = await resolver.signIn(signInInput);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        signInInput.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInInput.password,
        mockUser.password,
      );
      expect(authService.signToken).toHaveBeenCalledWith({
        id: mockUser.userId,
        email: mockUser.email,
      });
      expect(result).toEqual({ authToken: 'mock-auth-token' });
    });

    it('should throw error if user not found', async () => {
      usersService.getUserByEmail.mockResolvedValue(null);

      await expect(resolver.signIn(signInInput)).rejects.toThrow(HttpException);
    });

    it('should throw error if user is social auth', async () => {
      usersService.getUserByEmail.mockResolvedValue({
        ...mockUser,
        socialAuth: true,
      });

      await expect(resolver.signIn(signInInput)).rejects.toThrow(HttpException);
    });

    it('should throw error if password is incorrect', async () => {
      usersService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(resolver.signIn(signInInput)).rejects.toThrow(HttpException);
    });
  });

  describe('me', () => {
    it('should return user by id', async () => {
      usersService.getUserById.mockResolvedValue(mockUser);

      const result = await resolver.me('test-user-id');

      expect(usersService.getUserById).toHaveBeenCalledWith('test-user-id');
      expect(result).toEqual(mockUser);
    });
  });
});
