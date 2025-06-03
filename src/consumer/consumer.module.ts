import { Module } from '@nestjs/common';
import { MessageConsumerController } from './consumer.controller';

@Module({
  controllers: [MessageConsumerController]
})
export class ConsumerModule {}
