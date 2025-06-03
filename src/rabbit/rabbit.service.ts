import { HttpException, HttpStatus, Injectable,Logger } from '@nestjs/common';
import amqp, { Channel, ChannelWrapper, Options } from 'amqp-connection-manager';

@Injectable()
export class RabbitService {
  private channelWrapper: ChannelWrapper;

  constructor() {
    const connection = amqp.connect(['amqp://rabbitmq:5672']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('notification', {  
          durable: true,
  autoDelete: false,
  exclusive: false,});
      },
    });
  }

  async sendNotification(notification: any) {
    try {   
      await this.channelWrapper.sendToQueue( 'notification',
        Buffer.from(JSON.stringify(notification)))

        Logger.log('Sent To Queue');
      
    } catch (error) {
      throw new HttpException(
        'Error adding mail to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }
}