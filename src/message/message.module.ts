import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MessageController } from './message.controller';
import { RabbitModule } from 'src/rabbit/rabbit.module';

@Module({
  imports : [RabbitModule],
  controllers : [MessageController],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
