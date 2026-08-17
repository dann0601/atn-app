import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyTeam(user: AuthenticatedUser) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to view team details');
    }

    const team = await this.prisma.team.findUnique({
      where: {
        id: user.teamId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }
}
