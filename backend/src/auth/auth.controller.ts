import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    email: string;
    role: string;
    teamId: number | null;
  };
};

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}
