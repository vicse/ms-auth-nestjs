import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginUserDto, RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from '../common/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  signJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async registerUser({ password, ...restUserDto }: RegisterUserDto) {
    try {
      const user = await this.authRepository.findByEmail(restUserDto.email);
      if (user)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: `User already exists with email ${restUserDto.email}`,
        });

      const { id, name, email } = await this.authRepository.registerUser({
        ...restUserDto,
        password: bcrypt.hashSync(password, 10),
      });

      const newUser = { id, name, email };

      return {
        user: newUser,
        token: this.signJwt(newUser),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  async loginUser({ email, password }: LoginUserDto) {
    const user = await this.authRepository.findByEmail(email);
    if (!user)
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: `User/Password not valid`,
      });

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: `User/Password not valid`,
      });
    }

    const userLogged = { id: user.id, email: user.email, name: user.name };

    return {
      user: userLogged,
      token: this.signJwt(userLogged),
    };
  }

  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });
      const user = { id: payload.id, name: payload.name, email: payload.email };
      return {
        user,
        token: this.signJwt(user),
      };
    } catch (err) {
      console.log(err);
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token',
      });
    }
  }
}
