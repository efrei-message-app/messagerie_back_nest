import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { NotificationDto } from './rabbit.dto';

@Controller('rabbit')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class RabbitController {
  constructor(private readonly rabbitService: RabbitService) {}

  @Post('send')
  async send(@Body() payload: NotificationDto) {
    await this.rabbitService.sendNotification(payload);
    return { status: 'Message envoyé dans RabbitMQ' };
  }
}