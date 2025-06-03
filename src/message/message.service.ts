import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageInput } from './message.dto';
@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<any[]> {
    return this.prisma.message.findMany({});
  }
  async findOne(id: string) {
    return this.prisma.message.findUnique({
      where: { id }
    });
  }

  async create(data: CreateMessageInput) {
  return this.prisma.message.create({
    data,
    include: {
      sender: true,
      conversation: true,
    },
  });

  }
}