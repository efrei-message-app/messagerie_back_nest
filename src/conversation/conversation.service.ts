import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationInput, UpdateConversationInput } from './dto/conversation.input';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const conversations = await this.prisma.conversation.findMany({
      include: {
        participants: {
          include: { user: true },
        },
        messages: true,
      },
    });

    return conversations.map((c) => ({
      ...c,
      participants: c.participants.map((p) => p.user),
    }));
  }

  async findOne(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: { user: true },
        },
        messages: true,
      },
    });

    if (!conversation) return null;

    return {
      ...conversation,
      participants: conversation.participants.map((p) => p.user),
    };
  }

  async create(data: CreateConversationInput) {
    const conversation = await this.prisma.conversation.create({ data: {} });

    await this.prisma.conversationParticipant.createMany({
      data: data.participantIds.map((userId) => ({
        userId,
        conversationId: conversation.id,
      })),
    });

    return this.findOne(conversation.id); // recharger avec include
  }

  async update(id: string, data: UpdateConversationInput) {
    // Supprimer les anciens participants
    await this.prisma.conversationParticipant.deleteMany({
      where: { conversationId: id },
    });

    // Ajouter les nouveaux
    if (data.participantIds?.length) {
      await this.prisma.conversationParticipant.createMany({
        data: data.participantIds.map((userId) => ({
          userId,
          conversationId: id,
        })),
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.prisma.conversationParticipant.deleteMany({
      where: { conversationId: id },
    });

    return this.prisma.conversation.delete({ where: { id } });
  }
}