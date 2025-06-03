import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ConversationParticipant } from '../../conversation-participant/entities/conversation-participant.entity';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ConversationParticipant])
  participants: ConversationParticipant[];
}
