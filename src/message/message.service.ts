import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDB, CreateMessageInput } from './message.dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<any[]> {
    return this.prisma.message.findMany({});
  }

  async findOne(id: string): Promise<Message | null> {
    const prismaMessage = await this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: true,
        conversation: {
          include: {
            participants: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!prismaMessage) return null;

    const participants = prismaMessage.conversation.participants.map(p => p.user);

    return {
      ...prismaMessage,
      conversation: {
        ...prismaMessage.conversation,
        participants, 
      },
    } as unknown as Message; 
  }



  async create(data: CreateMessageDB) {
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

  async update(message : Message){
    return this.prisma.message.update({
      where :{
        id : message.id
      }, 
      data :{
        content : message.content,
        updatedAt : new Date()
      }
    })
  }
}