// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@ObjectType()
class AuthResponse {
  @Field()
  access_token: string;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async register(
    @Args('email') email: string,
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.register(email, username, password);
    return `User ${user.email} registered`;
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return this.authService.login(user);
  }
}