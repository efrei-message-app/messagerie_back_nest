import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from 'generated/prisma/client';

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Message[]> {
        return this.prisma.message.findMany({
          include: {
            user: true,
            conversations: true,
          },
        });
      }
      async findOne(id: string) {
        return this.prisma.message.findUnique({
          where: { id },
          include: {
            user: true,
            conversations: true,
          },
        });
      }
}