import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Conversation } from 'generated/prisma';

@Injectable()
export class ConversationService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Conversation[]> {
        return this.prisma.conversation.findMany({
          include: {
            user: true,
            messages: true,
          },
        });
      }
      async findOne(id: string) {
        return this.prisma.conversation.findUnique({
          where: { id },
          include: {
            user: true,
            messages: true,
          },
        });
      }
}