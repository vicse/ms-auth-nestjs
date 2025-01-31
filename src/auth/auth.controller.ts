import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser() {
    return this.registerUser.name;
  }

  @MessagePattern('auth.login.user')
  loginUser() {
    return this.loginUser.name;
  }

  @MessagePattern('auth.verify.token')
  verifyToken() {
    return this.verifyToken.name;
  }
}
