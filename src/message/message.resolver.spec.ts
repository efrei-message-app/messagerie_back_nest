import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let service: MessageService;

  const mockMessage = { id: '1', content: 'Hello', senderId: '1', conversationId: '10' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        {
          provide: MessageService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockMessage),
            findAll: jest.fn().mockResolvedValue([mockMessage]),
            findOne: jest.fn().mockResolvedValue(mockMessage),
          },
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
  });

  it('should create a message', async () => {
    expect(await resolver.createMessage({ content: 'Hello', senderId: '1', conversationId: '10' }))
      .toEqual(mockMessage);
  });

  it('should return all messages', async () => {
    expect(await resolver.findAll()).toEqual([mockMessage]);
  });

  it('should return a message by id', async () => {
    expect(await resolver.findOne('1')).toEqual(mockMessage);
  });
});
