import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateMessageInput } from 'src/message/message.dto';
@Controller()
export class MessageConsumerController {

  // @EventPattern('message.create')
  // async handleIncomingMessage(@Payload() data: CreateMessageInput, @Ctx() context: RmqContext) {
  //   const channel = context.getChannelRef();
  //   const originalMsg = context.getMessage();


  //   console.log(channel)
  //   console.log(originalMsg)
  //   console.log('Message reçu via RabbitMQ:', data);
  // }
}

