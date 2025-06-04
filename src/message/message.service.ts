import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageInput } from './message.dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<any[]> {
    return this.prisma.message.findMany({});
  }
  async findOne(id: string): Promise<Message | null>{
    return this.prisma.message.findUnique({
      where: { id }, 
      include: {
      sender: true,
      conversation: {include: {
          participants: true,
        }}
    },
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

  async delete(message : Message){
    return this.prisma.message.delete({
      where:{
        id : message.id
      }
    })
  }
}