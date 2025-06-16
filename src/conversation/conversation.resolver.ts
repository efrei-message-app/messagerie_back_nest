import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Conversation } from './entities/conversation.entity';
import { ConversationService } from './conversation.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/auth.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateConversationInput, UpdateConversationInput } from './dto/conversation.input';

@Resolver(() => Conversation)
export class ConversationResolver {
    constructor(
        private readonly conversationService : ConversationService,
        private readonly userService : UserService,
    ) { }

    @UseGuards(UserGuard)
    @Query(() => [Conversation], { name: 'conversations' })
    async findAll(@CurrentUser() user : User) {
                try {
        // FInd user
            const currentUser = await this.userService.findOneByMail(user.email);
            if(!currentUser) {
              throw new NotFoundException(`User not found`);
            }
            
          const conversations = await this.conversationService.findAll(currentUser.id)  

          if(!conversations){
            return []
          }

          return conversations;
        } catch (error) {
            throw error; 
        }
    }

    @UseGuards(UserGuard)
    @Query(() => Conversation, { name: 'conversation' })
    async findOne(@Args('id', { type: () => String }) id: string, @CurrentUser() user : User) {
        try {
        // FInd user
            const currentUser = await this.userService.findOneByMail(user.email);
            if(!currentUser) {
                throw new NotFoundException(`User not found`);
            }
            
            // Find conversation
            const conversation = await this.conversationService.findOne(id, currentUser.id)

            if(!conversation){
                throw new NotFoundException(`Conversation not found`);
            }

            return conversation;
        } catch (error) {
            throw error; 
        }
    }

    @UseGuards(UserGuard)
    @Mutation(() => Conversation)
    async createConversation(@Args('createConversationInput') createConversationInput: CreateConversationInput, @CurrentUser() user : User) {
       try {
        // FInd user
        const currentUser = await this.userService.findOneByMail(user.email);
        if(!currentUser) {
            throw new NotFoundException(`User not found`);
        }

        // create conversation

        const conversation = await this.conversationService.createConversation();

            const participants = Array.from(new Set([
            ...createConversationInput.participantIds,
            currentUser.id,
            ]));


        // assign participants 
        await this.conversationService.createParticipantConversation(participants, conversation.id)

        return this.conversationService.findOne(conversation.id, currentUser.id);
       } catch (error) {
        throw error
       }
  
    }

    // @UseGuards(UserGuard)
    // @Mutation(() => Conversation)
    // updateConversation(@Args('id') id: string, @Args('updateConversationInput') updateConversationInput: UpdateConversationInput, @CurrentUser() user : User) {
    //     return this.conversationService.update(id, updateConversationInput);
    // }

    // @UseGuards(UserGuard)
    // @Mutation(() => Conversation)
    // removeConversation(@Args('id') id: string,@CurrentUser() user : User) {
    //     return this.conversationService.remove(id);
    // }
}