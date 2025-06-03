import { Test, TestingModule } from '@nestjs/testing';
import { ConversationParticipantResolver } from './conversation-participant.resolver';
import { ConversationParticipantService } from './conversation-participant.service';

describe('ConversationParticipantResolver', () => {
  let resolver: ConversationParticipantResolver;

  const mockParticipant = { userId: '1', conversationId: '1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationParticipantResolver,
        {
          provide: ConversationParticipantService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockParticipant),
            findAll: jest.fn().mockResolvedValue([mockParticipant]),
            findOne: jest.fn().mockResolvedValue(mockParticipant),
          },
        },
      ],
    }).compile();

    resolver = module.get<ConversationParticipantResolver>(ConversationParticipantResolver);
  });

  it('should create a participant', async () => {
    expect(await resolver.createConversationParticipant(mockParticipant)).toEqual(mockParticipant);
  });

  it('should return all participants', async () => {
    expect(await resolver.findAll()).toEqual([mockParticipant]);
  });

  it('should return one participant', async () => {
    expect(await resolver.findOne('1', '1')).toEqual(mockParticipant);
  });
});
