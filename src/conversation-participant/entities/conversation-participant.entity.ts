import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ConversationParticipant {
  @Field()
  userId: string;

  @Field()
  conversationId: string;
}
