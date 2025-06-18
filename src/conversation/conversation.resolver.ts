import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Conversation } from './entities/conversation.entity';
import { ConversationService } from './conversation.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/auth.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateConversationInput, UpdateConversationInput } from './dto/conversation.input';
import { EventsGateway } from 'src/events/events.gateway';

@Resolver(() => Conversation)
export class ConversationResolver {
    constructor(
        private readonly conversationService : ConversationService,
        private readonly userService : UserService,
        private readonly socketService : EventsGateway
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
                ...createConversationInput.participantEmails,
                currentUser.email,
            ]));

            const userIds: string[] = await Promise.all(
                participants.map(async (email) => {
                const user = await this.userService.findOneByMail(email);

                if (!user) {
                    throw new NotFoundException(`User with email ${email} not found`);
                }
                return user.id;
                })
            );

        // assign participants 
        await this.conversationService.createParticipantConversation(userIds, conversation.id)

        return this.conversationService.findOne(conversation.id, currentUser.id);
       } catch (error) {
        throw error
       }
  
    }

    @UseGuards(UserGuard)
    @Mutation(() => String)
    async updateConversation(@Args('id') id: string, @Args('updateConversationInput') updateConversationInput: UpdateConversationInput, @CurrentUser() user : User) {
        try {

        // FInd user
        const currentUser = await this.userService.findOneByMail(user.email);
        if(!currentUser) {
            throw new NotFoundException(`User not found`);
        }

        // Find conversation depending id and user
        const conversation =  await this.conversationService.findOne(id, currentUser.id)

        if(!conversation) {
            throw new NotFoundException(`Conversation not found`);
        }

        // Delete participants
        await this.conversationService.deleteParticipants(conversation.id)


        // Assign new participants

        if(updateConversationInput?.participantEmails?.length && updateConversationInput?.participantEmails?.length !== 0){
            const participants = Array.from(new Set([
                ...updateConversationInput.participantEmails,
                currentUser.email,
            ]));

            const userIds: string[] = await Promise.all(
                participants.map(async (email) => {
                const user = await this.userService.findOneByMail(email);
                if (!user) {
                    throw new NotFoundException(`User with email ${email} not found`);
                }
                return user.id;
                })
            );

            // If users are still in room
                await this.conversationService.createParticipantConversation(userIds, conversation.id)
                
                const updatedConv = await this.findOne(conversation.id, currentUser)
                
                this.socketService.emitRoomChangesToConversation(conversation.id, {
                    type : "update",
                    id : updatedConv.id,
                    participants : updatedConv.participants.map((user)=>{
                        return {username : user.username, email : user.email, id : user.id}
                    }),
                    createdAt: updatedConv.createdAt,
                    updatedAt: updatedConv.updatedAt
                });

                return "Updated"

        }else{
            console.log("here")
            //  It means nobody is in the room so delete the conversation
                await this.conversationService.remove(conversation.id)
                this.socketService.emitRoomChangesToConversation(conversation.id, {
                    type : "deleted",
                });
            return "Updated"        
        
        }
            
        } catch (error) {
            throw error
        }
        
    }

    @UseGuards(UserGuard)
    @Mutation(() => String)
    async removeConversation(@Args('id') id: string,@CurrentUser() user : User) {

         // FInd user
        const currentUser = await this.userService.findOneByMail(user.email);
        if(!currentUser) {
            throw new NotFoundException(`User not found`);
        }

        // Find conversation depending id and user
        const conversation =  await this.conversationService.findOne(id, currentUser.id)

        if(!conversation) {
            throw new NotFoundException(`Conversation not found`);
        }

        // Delete conversation
        await this.conversationService.deleteParticipants(conversation.id)

        await this.conversationService.remove(conversation.id)

        return `conversation ${conversation.id} deleted`
    }
}