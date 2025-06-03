import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from './message.service';
import { CreateMessageInput } from './message.dto';
@Resolver(() => Message)
export class MessageResolver {
    constructor(private readonly messageService: MessageService) { }

    @Query(() => [Message], { name: 'messages' })
    findAll() {
        return this.messageService.findAll();
    }

    @Query(() => Message, { name: 'message' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.messageService.findOne(id);
    }

    @Mutation(() => Message)
    createMessage(@Args('data') data: CreateMessageInput) {
        return this.messageService.create(data);
    }
}