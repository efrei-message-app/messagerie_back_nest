import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) Active CORS pour votre front Next.js sur le port 4000
  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
  });

  // 2) Monte le microservice RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],   // ex: amqp://guest:guest@rabbitmq:5672
      queue: process.env.RABBITMQ_QUEUE,  // ex: channel_message
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
