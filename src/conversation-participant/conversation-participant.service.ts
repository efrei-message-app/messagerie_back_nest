import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationParticipant } from '@prisma/client';
import { CreateConversationParticipantInput } from './dto/conversation-participant.input';

@Injectable()
export class ConversationParticipantService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ConversationParticipant[]> {
    return this.prisma.conversationParticipant.findMany();
  }

  async findOne(userId: string, conversationId: string): Promise<ConversationParticipant | null> {
    return this.prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
    });
  }

  async create(data: CreateConversationParticipantInput): Promise<ConversationParticipant> {
    return this.prisma.conversationParticipant.create({ data });
  }

  async remove(userId: string, conversationId: string): Promise<ConversationParticipant> {
    return this.prisma.conversationParticipant.delete({
      where: {
        userId_conversationId: {
          userId,
          conversationId,
        },
      },
    });
  }
}
