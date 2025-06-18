import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';
import { UserService } from 'src/user/user.service';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { EventsGateway } from 'src/events/events.gateway';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;
  let mockConversationService: Partial<ConversationService>;
  let mockUserService: Partial<UserService>;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const socketServiceMock = {
    emitMessageToConversation: jest.fn(),
  };

  beforeEach(async () => {
    mockUserService = {
      findOneByMail: jest.fn().mockResolvedValue(mockUser),
    };

    mockConversationService = {
      findAll: jest.fn().mockResolvedValue([{ id: 'conv-id', participants: [mockUser] }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationResolver,
        { provide: UserService, useValue: mockUserService },
        { provide: ConversationService, useValue: mockConversationService },
        { provide: EventsGateway, useValue: socketServiceMock },
      ],
    }).compile();

    resolver = module.get<ConversationResolver>(ConversationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return conversations for a user', async () => {
      const result = await resolver.findAll(mockUser);
      expect(result).toHaveLength(1);
      expect(mockUserService.findOneByMail).toHaveBeenCalledWith(mockUser.email);
      expect(mockConversationService.findAll).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw if user is not found', async () => {
      jest.spyOn(mockUserService, 'findOneByMail').mockResolvedValueOnce(null);
      await expect(resolver.findAll(mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
