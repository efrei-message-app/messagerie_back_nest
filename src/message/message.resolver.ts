import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Message } from 'src/message/entities/message.entity';
import { CreateMessageInput, ModifyMessageInput } from './message.dto';
import { RabbitService } from 'src/rabbit/rabbit.service';
import { MessageResponse } from './dto/message.input';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { MessageController } from './message.controller';
import { UserGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/auth.decorator';
import { User } from 'src/user/entities/user.entity';
@Resolver(() => Message)
export class MessageResolver {
    constructor(
        private readonly messageService: MessageController,
        private readonly rabbitService : RabbitService
    ) { }

    // @Query(() => [Message], { name: 'messages' })
    // findAll() {
    //     return this.messageService.findAll();
    // }

    // @Query(() => Message, { name: 'message' })
    // findOne(@Args('id', { type: () => String }) id: string) {
    //     return this.messageService.findOne(id);
    // }

    @Mutation(() => MessageResponse)
    @UseGuards(UserGuard)
    async createMessage(
        @Args('data') data: CreateMessageInput,
        @CurrentUser() user : User
    ) {
        try {
        const payload = {
            conversationId : data.conversationId,
            content : data.content,
            email : user.email
         }
        await this.rabbitService.sendNotification(payload,"message.create");
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
        @Mutation(() => MessageResponse)
        @UseGuards(UserGuard)
        async deleteMessage(
        @Args('id', { type: () => String }) id: string,
        @CurrentUser() user : User, 
        ): Promise<MessageResponse> {
          const res = await this.messageService.deleteMessage(user.email, id);
          return res
        }

        @Mutation(() => MessageResponse)
        @UseGuards(UserGuard)
        async updateMessage(
        @Args('data') data: ModifyMessageInput,        
        @CurrentUser() user : User, 
        ): Promise<MessageResponse> {
          const res = await this.messageService.updateMessage(data, user.email);
          return res
        }
}