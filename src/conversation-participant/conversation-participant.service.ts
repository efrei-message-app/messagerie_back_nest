import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationParticipantInput } from './dto/conversation-participant.input';

@Injectable()
export class ConversationParticipantService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.conversationParticipant.findMany();
  }

  async findOne(userId: string, conversationId: string) {
    return this.prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId:{
          conversationId,
          userId,
        },
      },
    });
  }

  async create(data: CreateConversationParticipantInput) {
    return this.prisma.conversationParticipant.create({
      data: {
        userId: data.userId,
        conversationId: data.conversationId,
      },
    });
  }

  async remove(userId: string, conversationId: string) {
    return this.prisma.conversationParticipant.delete({
      where: {
        userId_conversationId: {
          conversationId,
          userId,
        },
      },
    });
  }
}
