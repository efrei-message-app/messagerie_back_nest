import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule } from './rabbit/rabbit.module'; 
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    MessageModule,
    RabbitModule,
    ConsumerModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}