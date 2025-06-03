import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MessageConsumerController {
  @EventPattern('messages.send')
  async handleIncomingMessage(@Payload() data: any) {
    console.log('Message reçu via RabbitMQ:', data);
    // traitement ici
  }
}
