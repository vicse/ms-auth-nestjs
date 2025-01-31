import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async registerUser({ email, name, password }: RegisterUserDto) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }
}
