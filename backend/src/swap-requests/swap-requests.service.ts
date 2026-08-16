import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSwapRequestDto } from './dto/create-swap-request.dto';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { SwapRequestStatus } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SwapRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    eventId: number,
    createSwapRequestDto: CreateSwapRequestDto,
    user: AuthenticatedUser,
  ) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to create swap requests');
    }

    if (user.userId === createSwapRequestDto.toUserId) {
      throw new BadRequestException('You cannot create a swap request with yourself');
    }

    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        teamId: user.teamId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const targetUser = await this.prisma.user.findFirst({
      where: {
        id: createSwapRequestDto.toUserId,
        teamId: user.teamId,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found in this team');
    }

    return this.prisma.swapRequest.create({
      data: {
        eventId,
        fromUserId: user.userId,
        toUserId: createSwapRequestDto.toUserId,
        status: SwapRequestStatus.pending,
      },
    });
  }

  async findAll(eventId: number, user: AuthenticatedUser) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to view swap requests');
    }

    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        teamId: user.teamId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.swapRequest.findMany({
      where: {
        eventId,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        toUser: {
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
