import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateMessageInput } from './message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}
      @EventPattern('message.create')
      async handleIncomingMessage(@Payload() data: CreateMessageInput, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
    
        await this.messageService.create(data)
        console.log(channel)
        console.log(originalMsg)
        console.log('Message reçu via RabbitMQ:', data);

        await channel.ack(originalMsg)
      }
}
