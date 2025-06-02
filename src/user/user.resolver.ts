import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  me(@CurrentUser() user: any) {
    return `You are connected as ${user.email}`;
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}