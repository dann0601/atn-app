import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateInvitationCodeDto } from './dto/create-invitation-code.dto';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitationCodesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createInvitationCodeDto: CreateInvitationCodeDto,
    user: AuthenticatedUser,
  ) {

    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to create invitation codes');
    }
    return this.prisma.invitationCode.create({
      data: {
        code: createInvitationCodeDto.code,
        role: createInvitationCodeDto.role,
        teamId: user.teamId,
      },
    });
  }

  findAll(user: AuthenticatedUser) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to view invitation codes');
    }
    return this.prisma.invitationCode.findMany({
      where: {
        teamId: user.teamId,
      },
      include: {
        usedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
