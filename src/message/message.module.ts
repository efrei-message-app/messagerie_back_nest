import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MessageController } from './message.controller';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { EventsModule } from 'src/events/events.module';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';
@Module({
  imports : [RabbitModule, UserModule, EventsModule, ConversationModule],
  controllers : [MessageController],
  providers: [MessageService, MessageResolver, MessageController],
})
export class MessageModule {}
