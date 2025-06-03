import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Conversation } from '@prisma/client';
import { CreateConversationInput, UpdateConversationInput } from './dto/conversation.input';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      include: {
        messages: true,
        participants: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: true,
        participants: true,
      },
    });
  }

  async create(data: CreateConversationInput): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        participants: {
          connect: data.participantIds.map((userId) => ({ id: userId })),
        },
      },
      include: {
        participants: true,
      },
    });
  }

  async update(id: string, data: UpdateConversationInput): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: { id },
      data: data.participantIds
        ? {
            participants: {
              set: data.participantIds.map((userId) => ({ id: userId })),
            },
          }
        : {},
      include: {
        participants: true,
      },
    });
  }

  async remove(id: string): Promise<Conversation> {
    return this.prisma.conversation.delete({ where: { id } });
  }
}