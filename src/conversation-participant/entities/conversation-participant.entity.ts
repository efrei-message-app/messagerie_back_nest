import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class ConversationParticipant {
  @Field()
  userId: string;

  @Field()
  conversationId: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
