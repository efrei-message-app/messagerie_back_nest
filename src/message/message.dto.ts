import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  content: string;

  @Field()
  senderId: string;

  @Field()
  conversationId: string;
}
