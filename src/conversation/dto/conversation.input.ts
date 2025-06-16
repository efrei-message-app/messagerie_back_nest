import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => [ID])
  participantEmails: string[];
}

@InputType()
export class UpdateConversationInput {
  @Field(() => [ID], { nullable: true })
  participantEmails?: string[];
}