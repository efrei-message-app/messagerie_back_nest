import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from './message.service';
import { CreateMessageInput } from './message.dto';
import { RabbitService } from 'src/rabbit/rabbit.service';
import { MessageResponse } from './dto/message.input';
import { HttpException, HttpStatus } from '@nestjs/common';
@Resolver(() => Message)
export class MessageResolver {
    constructor(
        private readonly messageService: MessageService,
        private readonly rabbitService : RabbitService
    ) { }

    @Query(() => [Message], { name: 'messages' })
    findAll() {
        return this.messageService.findAll();
    }

    @Query(() => Message, { name: 'message' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.messageService.findOne(id);
    }

    @Mutation(() => MessageResponse)
    async createMessage(@Args('data') data: CreateMessageInput) {
        try {
        await this.rabbitService.sendNotification(data,"message.create");
        return { status: 'Message envoyé dans RabbitMQ' };
         } catch (error) {
            throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'This is a custom message',
            }, HttpStatus.FORBIDDEN, {
            cause: error
            });
        }
    }
}