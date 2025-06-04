import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  createUser(@Args('data') data: CreateUserInput) {
    return this.userService.create(data);
  }

  @Mutation(() => User)
  updateUser(@Args('id') id: string, @Args('data') data: UpdateUserInput) {
    return this.userService.update(id, data);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }
}
