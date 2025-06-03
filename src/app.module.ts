import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { RabbitService } from './rabbit/rabbit.service';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitController } from './rabbit/rabbit.controller';
import { ConsumerService } from './consumer/consumer.service';
@Module({
  imports: [HealthModule, ConfigModule.forRoot(), MessageModule],
  controllers: [AppController, RabbitController],
  providers: [AppService, RabbitService, ConsumerService],
})
export class AppModule {}
