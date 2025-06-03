import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { RabbitController } from './rabbit.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [RabbitController],
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {}
