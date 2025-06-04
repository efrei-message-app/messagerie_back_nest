import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  content: string;

  @Field()
  senderId: string;

  @Field()
  conversationId: string;
}

@ObjectType()
export class MessageResponse {
  @Field()
  status: string;
}

