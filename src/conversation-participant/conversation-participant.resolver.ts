import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ConversationParticipantService } from './conversation-participant.service';
import { CreateConversationParticipantInput } from './dto/conversation-participant.input';
import { ConversationParticipant } from './entities/conversation-participant.entity';

@Resolver(() => ConversationParticipant)
export class ConversationParticipantResolver {
  constructor(private readonly conversationParticipantService: ConversationParticipantService) {}

  @Query(() => [ConversationParticipant], { name: 'conversationParticipants' })
  findAll() {
    return this.conversationParticipantService.findAll();
  }

  @Query(() => ConversationParticipant, { name: 'conversationParticipant' })
  findOne(
    @Args('userId') userId: string,
    @Args('conversationId') conversationId: string,
  ) {
    return this.conversationParticipantService.findOne(userId, conversationId);
  }

  @Mutation(() => ConversationParticipant)
  createConversationParticipant(@Args('data') data: CreateConversationParticipantInput) {
    return this.conversationParticipantService.create(data);
  }

  @Mutation(() => ConversationParticipant)
  removeConversationParticipant(
    @Args('userId') userId: string,
    @Args('conversationId') conversationId: string,
  ) {
    return this.conversationParticipantService.remove(userId, conversationId);
  }
}
