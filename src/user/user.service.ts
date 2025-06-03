import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        messages: true
      },
    });
  }
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        messages: true
      },
    });
  }
}
