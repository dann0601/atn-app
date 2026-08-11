import { Body, Controller, Post } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  join(@Body() joinDto: JoinDto) {
    return this.authService.join(joinDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
