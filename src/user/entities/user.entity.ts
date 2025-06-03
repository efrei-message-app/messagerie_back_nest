import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Message], { nullable: 'items' })
  messages?: Message[];

  @Field(() => [Conversation], { nullable: 'items' })
  conversations?: Conversation[];
}
