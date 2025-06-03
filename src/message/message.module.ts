import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MessageController } from './message.controller';

@Module({
  controllers : [MessageController],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
