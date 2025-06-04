import { Controller, NotFoundException } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateMessageInput } from './message.dto';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';

@Controller('message')
export class MessageController {
    constructor(
      private readonly messageService: MessageService,
      private readonly userService: UserService
    ) {}
      @EventPattern('message.create')
      async handleIncomingMessage(@Payload() data: CreateMessageInput, @Ctx() context: RmqContext) {
        try {
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
        
            await this.messageService.create(data)

            channel.ack(originalMsg)
            
        } catch (error) {
            console.log(error)       
        }

      }

      async deleteMessage(mail : string, messageId : string){
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

            // If not found return error
            if(message?.sender.id !== user.id){
              throw new NotFoundException(`Message avec l'email ${mail}  et l'id ${message?.id} introuvable`);
            }
          // Else 
            await this.messageService.delete(message)

            return { message: 'Message supprimé avec succès' };
          
        } catch (error) {
           throw error; 
        }

      }
}
