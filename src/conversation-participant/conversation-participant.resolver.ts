import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ConversationParticipantService } from './conversation-participant.service';
import { CreateConversationParticipantInput } from './dto/conversation-participant.input';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver(() => ConversationParticipant)
export class ConversationParticipantResolver {
  constructor(
    private readonly conversationParticipantService: ConversationParticipantService,
    private readonly userService: UserService
  ) {}

  @Query(() => [ConversationParticipant], { name: 'conversationParticipants' })
  findAll() {
    return this.conversationParticipantService.findAll();
  }

  @Query(() => ConversationParticipant, { name: 'conversationParticipant' })
  findOne(
    @Args('userId') userId: string,
    @Args('conversationId') conversationId: string,
  ) {
    return this.conversationParticipantService.findOne(userId, conversationId);
  }

  @Mutation(() => ConversationParticipant)
  createConversationParticipant(@Args('data') data: CreateConversationParticipantInput) {
    return this.conversationParticipantService.create(data);
  }

  @Mutation(() => ConversationParticipant)
  removeConversationParticipant(
    @Args('userId') userId: string,
    @Args('conversationId') conversationId: string,
  ) {
    return this.conversationParticipantService.remove(userId, conversationId);
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() participant: ConversationParticipant): Promise<User | null> {
    return this.userService.findOne(participant.userId);
  } 
  
}
