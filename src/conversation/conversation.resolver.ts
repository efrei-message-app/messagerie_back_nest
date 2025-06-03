import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Conversation } from './entities/conversation.entity';
import { ConversationService } from './conversation.service';
import { CreateConversationInput, UpdateConversationInput } from './dto/conversation.input';

@Resolver(() => Conversation)
export class ConversationResolver {
    constructor(private readonly conversationService: ConversationService) { }

    @Query(() => [Conversation], { name: 'conversations' })
    findAll() {
        return this.conversationService.findAll();
    }

    @Query(() => Conversation, { name: 'conversation' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.conversationService.findOne(id);
    }

    @Mutation(() => Conversation)
    createConversation(@Args('data') data: CreateConversationInput) {
        return this.conversationService.create(data);
    }

    @Mutation(() => Conversation)
    updateConversation(@Args('id') id: string, @Args('data') data: UpdateConversationInput) {
        return this.conversationService.update(id, data);
    }

    @Mutation(() => Conversation)
    removeConversation(@Args('id') id: string) {
        return this.conversationService.remove(id);
    }
}