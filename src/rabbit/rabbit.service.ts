import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  EventPattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { NotificationDto } from './rabbit.dto';

@Injectable()
export class RabbitService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'channel_message',
      },
    });
  }

  async sendNotification(notification: NotificationDto) {
    return await this.client
      .emit('messages.send', notification)
      .toPromise();
  }

  @EventPattern('messages.send') 
  async handleIncomingMessage(@Payload() message: any) {
    console.log('Message reçu via RabbitMQ:', message);
  }
}