import { Injectable } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  join(joinDto: JoinDto) {
    return joinDto;
  }

  login(loginDto: LoginDto) {
    return loginDto;
  }
}
