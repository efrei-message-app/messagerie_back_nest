import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    const users = await this.prisma.user.findMany({
      include: {
        messages: true,
        participants: {
          include: {
            conversation: true,
          },
        },
      },
    });

    return users.map((user) => ({
      ...user,
      conversations: user.participants.map((p) => p.conversation),
    }));
  }

  async findOne(id: string): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        messages: true,
        participants: {
          include: {
            conversation: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      conversations: user.participants.map((p) => p.conversation),
    };
  }

  async create(data: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}