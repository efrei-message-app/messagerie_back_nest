import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [User], { nullable: 'items' })
  participants?: User[];

  @Field(() => [Message], { nullable: 'items' })
  messages?: Message[];
}
