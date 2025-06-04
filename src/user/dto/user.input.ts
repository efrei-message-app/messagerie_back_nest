// src/user/dto/user.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string; 
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  password?: string; 
}