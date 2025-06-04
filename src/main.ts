import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser le front (http://localhost:4000) à faire des requêtes CORS
  app.enableCors({
    origin: 'http://localhost:4000',
    // credentials: true,  // à décommenter si vous utilisez des cookies/httpOnly
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'channel_message',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
