import { Controller, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ModifyMessageInput } from './message.dto';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';
import { MessageResponse } from './dto/message.input';
import { MessageCreateRabbitMQPayload } from './dto/message.input';
import { EventsGateway } from 'src/events/events.gateway';
import { ConversationService } from 'src/conversation/conversation.service';

@Controller('message')
export class MessageController {
    constructor(
      private readonly messageService: MessageService,
      private readonly userService: UserService,
      private readonly socketService : EventsGateway,
      private readonly conversationService : ConversationService
    ) {}
      @EventPattern('message.create')
      async handleIncomingMessage(@Payload() data: MessageCreateRabbitMQPayload, @Ctx() context: RmqContext) {
        try {
            console.log(data.conversationId)
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();

            const user = await this.userService.findOneByMail(data.email)
            if(!user) {
              console.log(`Cannot insert message from ${data.email}`)
            }else{
                const conversation = await this.conversationService.findOne(data.conversationId, user.id)


                if(!conversation){
                  throw new NotFoundException(`Conversation ${data.conversationId} not found`);
                }
               const message = await this.messageService.create({
                  content: data.content, 
                  conversationId: conversation.id, 
                  senderId : user.id})

                this.socketService.emitMessageToConversation(data.conversationId, {
                type : "creation",
                content: data.content,
                sender: {
                  email: user.email,
                },
                conversationId: data.conversationId,
                createdAt: message.createdAt,
                updatedAt : message.updatedAt
              });


              console.log('message created')

                channel.ack(originalMsg)
            }         
        } catch (error) {
            console.log(error)       
        }

      }

      async deleteMessage(mail : string, messageId : string) : Promise<MessageResponse>{
        try {
          // Find user 
            const user = await this.userService.findOneByMail(mail)

            if(!user) {
              throw new NotFoundException(`Utilisateur avec l'email ${mail} introuvable`);
            }
          // Find message by user and ID
            const message = await this.messageService.findOne(messageId)

            if(!message) {
              throw new NotFoundException(`Message not found`);
            }

            const existingUser = message.conversation.participants.findIndex((participant) => participant.id === user.id)

            if(existingUser == -1 ){
              throw new UnauthorizedException(`Cannot delete a message from a conv you are not joined`);
            }

            // If not found return error
            if(message?.sender.id !== user.id){
              throw new NotFoundException(`Message avec l'email ${mail}  et l'id ${message?.id} introuvable`);
            }
          // Else 
            await this.messageService.delete(message)


            // Send in ws message to delete
            this.socketService.emitMessageToConversation(message.conversation.id, {
                type : "delete",
                content: message.content,
                sender: {
                  email: user.email,
                },
                conversationId: message.conversation.id,
                createdAt: message.createdAt,
                updatedAt : message.updatedAt
              });
            


            return { status: 'Message supprimé avec succès' };
          
        } catch (error) {
           throw error; 
        }

      }


    @EventPattern('message.update')
    async updateMessage(@Payload() data: ModifyMessageInput, @Ctx() context: RmqContext) {
    // async updateMessage(data : ModifyMessageInput, email : string) : Promise<MessageResponse>{

        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {

            const user = await this.userService.findOneByMail(data.email)

            if(!user) {
              throw new NotFoundException(`User not found`);
            }

          // Find message by user and ID
            let message = await this.messageService.findOne(data.messageId)

            if(!message) {
              throw new NotFoundException(`Message not found`);
            }

            const existingUser = message.conversation.participants.findIndex((participant) => participant.id === user.id)

            if(existingUser == -1 ){
              throw new UnauthorizedException(`Cannot modify a message from a conv you are not joined`);
            }

            // If not found return error
            if(message?.sender.id !== user.id){
              throw new NotFoundException(`Message avec l'email ${data.email}  et l'id ${message?.id} introuvable`);
            }
          // Else 
            message.content = data.content;
            const newMessage = await this.messageService.update(message)


            this.socketService.emitMessageToConversation(message.conversation.id, {
                type : "update",
                content: message.content,
                sender: {
                  email: user.email,
                },
                conversationId: message.conversation.id,
                createdAt: newMessage.createdAt,
                updatedAt : newMessage.updatedAt
              });
            

            channel.ack(originalMsg)
          
        } catch (error) {
           throw error; 
        }
    }
}
