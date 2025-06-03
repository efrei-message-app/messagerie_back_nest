import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';
import { CreateMessageInput } from './dto/message.input';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<Message[]> {
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