import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async join(joinDto: JoinDto) {
    const invitationCode = await this.prisma.invitationCode.findUnique({
      where: {
        code: joinDto.code,
      },
    });

    if (!invitationCode) {
      throw new BadRequestException('Invalid invitation code');
    }

    if (invitationCode.used) {
      throw new BadRequestException('Invitation code already used');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: joinDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(joinDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: joinDto.name,
        email: joinDto.email,
        passwordHash,
        role: invitationCode.role,
        teamId: invitationCode.teamId,
      },
    });

    await this.prisma.invitationCode.update({
      where: {
        id: invitationCode.id,
      },
      data: {
        used: true,
        usedByUserId: user.id,
      },
    });

    const { passwordHash: storedPasswordHash, ...userWithoutPassword } = user;
    void storedPasswordHash;

    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    void passwordHash;

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
       user: userWithoutPassword,
    };
  }
}
