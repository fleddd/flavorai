import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
  }
  async createUser(email: string, password: string) {
    return this.prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }
  async updateUserById(id: string, data: Partial<User>) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
