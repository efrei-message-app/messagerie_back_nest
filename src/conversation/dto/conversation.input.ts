import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => [String])
  participantIds: string[]; // ou [ID], selon ton entity User
}

@InputType()
export class UpdateConversationInput {
  @Field({ nullable: true })
  dummyField?: string; // à adapter quand tu feras des updates réelles
}
