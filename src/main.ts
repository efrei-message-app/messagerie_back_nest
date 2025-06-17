import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],   
      queue: process.env.RABBITMQ_QUEUE, 
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();