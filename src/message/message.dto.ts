import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class MessageInput {
  @Field()
  content: string;
}

@InputType()
export class CreateMessageInput  extends MessageInput{
  @Field()
  conversationId: string;
}


@InputType()
export class ModifyMessageInput extends MessageInput {
  @Field()
  messageId: string;
}


@InputType()
export class CreateMessageDB  extends MessageInput{
  @Field()
  conversationId: string;
  senderId : string
}