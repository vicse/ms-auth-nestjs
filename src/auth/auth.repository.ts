import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser({ email, name, password }: RegisterUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: `User already exists with email ${email}`,
        });
      }

      const newUser = await this.prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      });

      return {
        user: newUser,
        token: 'asdasd',
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
