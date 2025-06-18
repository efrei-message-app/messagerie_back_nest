import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
  };

  const prismaServiceMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const userServiceMock = {
    findOneByMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      userServiceMock.findOneByMail.mockResolvedValue(null);
      prismaServiceMock.user.create.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.register('test@example.com', 'testuser', 'password123');

      expect(userServiceMock.findOneByMail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: 'hashedPassword',
        },
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      userServiceMock.findOneByMail.mockResolvedValue(mockUser);

      await expect(service.register('test@example.com', 'testuser', 'password123'))
        .rejects
        .toThrow(UnauthorizedException);

      expect(userServiceMock.findOneByMail).toHaveBeenCalledWith('test@example.com');
      expect(prismaServiceMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('unknown@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const userPayload = { email: 'test@example.com' };
      jwtServiceMock.sign.mockReturnValue('signed.jwt.token');

      const result = await service.login(userPayload);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ email: userPayload.email });
      expect(result).toEqual({ access_token: 'signed.jwt.token' });
    });
  });

});
