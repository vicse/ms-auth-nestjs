import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  registerUser(registerUserDto: RegisterUserDto) {
    return this.authRepository.registerUser(registerUserDto);
  }
}
