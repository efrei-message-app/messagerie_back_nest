import { Resolver, Query, Args } from '@nestjs/graphql';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
    constructor(private readonly messageService: MessageService) {}

    @Query(() => [Message], { name: 'messages'})
    findAll() {
        return this.messageService.findAll();
    }

    @Query(() => Message, { name: 'message' })
      findOne(@Args('id', { type: () => String }) id: string) {
        return this.messageService.findOne(id);
    }
}