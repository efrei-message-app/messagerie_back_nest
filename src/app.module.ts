import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule } from './rabbit/rabbit.module'; // 👈 Ajoute ça

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ global
    HealthModule,
    MessageModule,
    RabbitModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}