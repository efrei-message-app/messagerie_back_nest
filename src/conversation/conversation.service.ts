import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationInput } from './dto/conversation.input';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateConversationInput) {
    return this.prisma.conversation.create({
      data: {
        participants: {
          create: data.participantIds.map(userId => ({
            user: { connect: { id: userId } }
          }))
        }
      },
      include: { participants: true },
    });
  }
  

  async remove(id: string) {
    return this.prisma.conversation.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.conversation.findMany({
      include: { participants: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: { participants: true },
    });
  }
}
