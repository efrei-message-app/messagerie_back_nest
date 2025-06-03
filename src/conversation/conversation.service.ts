import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Conversation } from '@prisma/client';
import { CreateConversationInput, UpdateConversationInput } from './dto/conversation.input';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      include: {
        messages: true,
      },
    });
  }
  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: true,
      },
    });
  }
  async create(data: CreateConversationInput): Promise<Conversation> {
    return this.prisma.conversation.create({ data });
  }

  async update(id: string, data: UpdateConversationInput): Promise<Conversation> {
    return this.prisma.conversation.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Conversation> {
    return this.prisma.conversation.delete({ where: { id } });
  }
}