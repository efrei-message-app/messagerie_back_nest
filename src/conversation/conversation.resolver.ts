import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput } from './dto/conversation.input';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Mutation(() => Conversation)
  createConversation(@Args('data') data: CreateConversationInput) {
    return this.conversationService.create(data);
  }

  @Mutation(() => Conversation)
  removeConversation(@Args('id') id: string) {
    return this.conversationService.remove(id);
  }

  @Query(() => [Conversation])
  conversations() {
    return this.conversationService.findAll();
  }

  @Query(() => Conversation, { nullable: true })
  conversation(@Args('id') id: string) {
    return this.conversationService.findOne(id);
  }
}
