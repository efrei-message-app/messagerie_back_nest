import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => [ID])
  participantIds: string[];
}

@InputType()
export class UpdateConversationInput {
  @Field(() => [ID], { nullable: true })
  participantIds?: string[];
}