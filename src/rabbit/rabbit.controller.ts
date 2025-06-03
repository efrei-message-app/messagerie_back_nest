import { Controller, Post, Body } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { NotificationDto } from './rabbit.dto';

@Controller('rabbit')
export class RabbitController {
  constructor(private readonly rabbitService: RabbitService) {}

  @Post('send')
  async send(@Body() payload: NotificationDto) {
    await this.rabbitService.sendNotification(payload);
    return { status: 'Message envoyé dans RabbitMQ' };
  }
}
