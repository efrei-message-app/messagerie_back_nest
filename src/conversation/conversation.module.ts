import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { UserService } from 'src/user/user.service';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  providers: [ConversationService, ConversationResolver, UserService, EventsGateway],
  exports:[ConversationService]
})
export class ConversationModule {}
