import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  RmqOptions,
} from '@nestjs/microservices';
import { NotificationDto } from './rabbit.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitService {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    const rmqOptions: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
        queue: this.configService.get<string>('RABBITMQ_QUEUE')!,
      },
    };

    this.client = ClientProxyFactory.create(rmqOptions);
  }

  async sendNotification(notification: NotificationDto) {
    return this.client.emit('messages.send', notification).toPromise();
  }

  async handleIncomingMessage(message: any) {
    console.log('Message reçu via RabbitMQ:', message);
  }
}