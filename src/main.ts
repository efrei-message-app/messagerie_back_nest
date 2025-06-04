// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ----------------------------
  // 1) Autoriser le CORS pour tout appel venant de http://localhost:4000
  // ----------------------------
  app.enableCors({
    origin: 'http://localhost:4000',
    // si vous avez besoin de cookies ou tokens httpOnly, dé-commentez :
    // credentials: true,
  });

  // ----------------------------
  // 2) Connexion à votre microservice RabbitMQ
  // ----------------------------
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'channel_message',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  // Démarre l’écoute du microservice
  await app.startAllMicroservices();
  // Démarre l’API NestJS sur le port 3000
  await app.listen(3000);
}
bootstrap();
