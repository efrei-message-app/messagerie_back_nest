import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Message[]> {
        return this.prisma.message.findMany({});
      }
      async findOne(id: string) {
        return this.prisma.message.findUnique({
          where: { id }
        });
      }
}