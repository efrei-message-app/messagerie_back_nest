import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  username: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;
}
