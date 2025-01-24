import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { Public } from './constant';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/')
  async signIn(@Body() signInAuthDto: SigninAuthDto) {
    return await this.authService.signIn(signInAuthDto);
  }
}
