import { Resolver, Query, Args } from '@nestjs/graphql';
import { Conversation } from './entities/conversation.entity';
import { ConversationService } from './conversation.service';

@Resolver(() => Conversation)
export class ConversationResolver {
    constructor(private readonly conversationService: ConversationService) {}

    @Query(() => [Conversation], { name: 'conversations'})
    findAll() {
        return this.conversationService.findAll();
    }

    @Query(() => Conversation, { name: 'conversation' })
      findOne(@Args('id', { type: () => String }) id: string) {
        return this.conversationService.findOne(id);
    }
}