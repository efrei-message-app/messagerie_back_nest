import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authServiceMock: Record<string, jest.Mock>;

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return success message', async () => {
      const mockUser = { email: 'test@example.com' };
      authServiceMock.register.mockResolvedValue(mockUser);

      const result = await resolver.register('test@example.com', 'username', 'password123');

      expect(authServiceMock.register).toHaveBeenCalledWith('test@example.com', 'username', 'password123');
      expect(result).toBe('User test@example.com registered');
    });
  });

  describe('login', () => {
    it('should return access token if credentials are valid', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockToken = { access_token: 'jwt.token' };

      authServiceMock.validateUser.mockResolvedValue(mockUser);
      authServiceMock.login.mockResolvedValue(mockToken);

      const result = await resolver.login('test@example.com', 'password123');

      expect(authServiceMock.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(authServiceMock.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockToken);
    });

    it('should throw error if credentials are invalid', async () => {
      authServiceMock.validateUser.mockResolvedValue(null);

      await expect(
        resolver.login('wrong@example.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid email or password');

      expect(authServiceMock.validateUser).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });
  });
});
