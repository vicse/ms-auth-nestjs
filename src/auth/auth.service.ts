import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async registerUser({ password, ...restUserDto }: RegisterUserDto) {
    try {
      const user = await this.authRepository.findByEmail(restUserDto.email);
      if (user)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: `User already exists with email ${restUserDto.email}`,
        });

      const { password: __, ...restNewUser } =
        await this.authRepository.registerUser({
          ...restUserDto,
          password: bcrypt.hashSync(password, 10),
        });

      return {
        user: restNewUser,
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
