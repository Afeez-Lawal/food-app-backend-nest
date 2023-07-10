import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/callback/google')
  async googleLogin(@Body('token') token: string) {
    return await this.authService.googleLogin(token);
  }
}
