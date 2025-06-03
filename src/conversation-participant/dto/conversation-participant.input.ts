import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationParticipantInput {
  @Field()
  userId: string;

  @Field()
  conversationId: string;
}

@InputType()
export class UpdateConversationParticipantInput {
  // Pas de champs modifiables pour cette entité, la clé est composite
}
