import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne(id);
  }
}
