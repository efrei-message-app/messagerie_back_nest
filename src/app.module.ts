import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { HealthModule } from './health/health.module';
import { MessageModule } from './message/message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { ConversationModule } from './conversation/conversation.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    HealthModule,
    MessageModule,
    RabbitModule,
    PrismaModule,
    UserModule,
    MessageModule,
    ConversationModule,
    
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [AuthModule],
      inject: [ConfigService, JwtService],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService, jwtService: JwtService) => ({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
        context: ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        let user: any = null; let jwtErrorMessage : any = null;

      if (token) {
        try {
          user = jwtService.verify(token, { secret: configService.get('JWT_SECRET')});
        } catch (err) {
          console.log(err)
        }
      }

      return { req, user,jwtErrorMessage };
    }}),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}