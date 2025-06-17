import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ConversationService, ConversationResolver, UserService],
  exports:[ConversationService]
})
export class ConversationModule {}
