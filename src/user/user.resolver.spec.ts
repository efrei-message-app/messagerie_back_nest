import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  const mockUser = { id: '1', email: 'a@a.com', username: 'alice' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    expect(await resolver.createUser({ email: 'a@a.com', username: 'alice' })).toEqual(mockUser);
  });

  it('should return all users', async () => {
    expect(await resolver.findAll()).toEqual([mockUser]);
  });

  it('should return a user by id', async () => {
    expect(await resolver.findOne('1')).toEqual(mockUser);
  });
});
