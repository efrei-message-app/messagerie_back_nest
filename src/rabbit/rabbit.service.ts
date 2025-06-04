import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  RmqOptions,
} from '@nestjs/microservices';
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

  async sendNotification(notification: any, routingKey : string) {
    return this.client.emit(routingKey, notification);
  }

}