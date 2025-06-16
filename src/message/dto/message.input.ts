import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class MessageCreateRabbitMQPayload {
  @Field()
  content: string;

  @Field()
  email: string;

  @Field()
  conversationId: string;
}

@ObjectType()
export class MessageResponse {
  @Field()
  status: string;
}

