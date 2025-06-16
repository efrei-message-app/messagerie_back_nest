import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MessageController } from './message.controller';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [RabbitModule, UserModule],
  controllers : [MessageController],
  providers: [MessageService, MessageResolver, MessageController],
})
export class MessageModule {}
