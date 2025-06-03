import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RabbitService } from '../rabbit/rabbit.service';

@Resolver()
export class MessageResolver {
  constructor(private readonly rabbitService: RabbitService) {}

  @Mutation(() => String)
  async sendMessage(
    @Args('email') email: string,
    @Args('message') message: string,
    @Args('routingKey') routingKey: string,
  ) {
    await this.rabbitService.sendNotification({ email, message }, routingKey);
    return 'Message envoyé via RabbitMQ';
  }
}