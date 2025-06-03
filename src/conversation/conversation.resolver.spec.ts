import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;

  const mockConversation = { id: '1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationResolver,
        {
          provide: ConversationService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockConversation),
            findAll: jest.fn().mockResolvedValue([mockConversation]),
            findOne: jest.fn().mockResolvedValue(mockConversation),
          },
        },
      ],
    }).compile();

    resolver = module.get<ConversationResolver>(ConversationResolver);
  });

  it('should create a conversation', async () => {
    expect(await resolver.createConversation({})).toEqual(mockConversation);
  });

  it('should return all conversations', async () => {
    expect(await resolver.findAll()).toEqual([mockConversation]);
  });

  it('should return a conversation by id', async () => {
    expect(await resolver.findOne('1')).toEqual(mockConversation);
  });
});
