import { Controller, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ModifyMessageInput } from './message.dto';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';
import { MessageResponse } from './dto/message.input';
import { MessageCreateRabbitMQPayload } from './dto/message.input';

@Controller('message')
export class MessageController {
    constructor(
      private readonly messageService: MessageService,
      private readonly userService: UserService
    ) {}
      @EventPattern('message.create')
      async handleIncomingMessage(@Payload() data: MessageCreateRabbitMQPayload, @Ctx() context: RmqContext) {
        try {
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();

            const user = await this.userService.findOneByMail(data.email)
            if(!user) {
              console.log(`Cannot insert message from ${data.email}`)
            }else{
                await this.messageService.create({
                  content: data.content, 
                  conversationId: data.conversationId, 
                  senderId : user.id})

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

            return { status: 'Message supprimé avec succès' };
          
        } catch (error) {
           throw error; 
        }

      }


    async updateMessage(data : ModifyMessageInput, email : string) : Promise<MessageResponse>{
        try {

            const user = await this.userService.findOneByMail(email)

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
              throw new NotFoundException(`Message avec l'email ${email}  et l'id ${message?.id} introuvable`);
            }
          // Else 
            message.content = data.content;
            await this.messageService.update(message)

            return { status: 'Message modifié avec succès' };
          
        } catch (error) {
           throw error; 
        }
    }
}
