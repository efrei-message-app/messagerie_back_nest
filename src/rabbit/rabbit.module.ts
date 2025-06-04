import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {}
