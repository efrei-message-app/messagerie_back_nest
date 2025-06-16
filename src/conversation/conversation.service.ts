import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationInput, UpdateConversationInput } from './dto/conversation.input';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userid : string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
      participants: {
        some: {
          userId: userid,
        },
      },
    },
      include: {
        participants: {
          include: { 
            user: true
          },
        },
          messages: {
          include: { sender: true },
        },
      },
    });

    return conversations.map((c) => ({
      ...c,
      participants: c.participants.map((p) => p.user),
    }));
  }

  async findOne(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id,
        participants: {
          some: {
            userId: userId,
          },
        },
      },
        include: {
        participants: {
          include: { 
            user: true
          },
        },
          messages: {
          include: { sender: true },
        },
      },
    });

    if (!conversation) return null;

    return {
      ...conversation,
      participants: conversation.participants.map((p) => p.user),
    };
  }


  async createConversation() {
    const conversation = await this.prisma.conversation.create({ data: {} });
    return conversation;
  }

  async createParticipantConversation(participants : string[], conversationId : string){
    await this.prisma.conversationParticipant.createMany({
      data: participants.map((userId) => ({
        userId,
        conversationId: conversationId,
      })),
    });
  }

  async deleteParticipants(id: string) {
    await this.prisma.conversationParticipant.deleteMany({
      where: { conversationId: id },
    });
  }

  async remove(id: string) {
    await this.prisma.conversation.delete({ where: { id } });
  }
}