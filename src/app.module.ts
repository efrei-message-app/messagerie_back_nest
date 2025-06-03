import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { HealthModule } from './health/health.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConsumerModule } from './consumer/consumer.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { ConversationModule } from './conversation/conversation.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    MessageModule,
    RabbitModule,
    ConsumerModule, 
    PrismaModule,
    UserModule,
    MessageModule,
    ConversationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}