import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationParticipantInput {
  @Field()
  userId: string;

  @Field()
  conversationId: string;
}
