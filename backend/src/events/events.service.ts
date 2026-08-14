import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createEventDto: CreateEventDto,
    user: {
      userId: number;
      email: string;
      role: string;
      teamId: number | null;
    },
  ) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to create events');
    }

    return this.prisma.event.create({
      data: {
        title: createEventDto.title,
        date: new Date(createEventDto.date),
        time: createEventDto.time,
        location: createEventDto.location,
        description: createEventDto.description,
        equipmentNeeded: createEventDto.equipmentNeeded,
        status: 'upcoming',
        teamId: user.teamId,
        createdByUserId: user.userId,
      },
    });
  }

  findAll(user: {
    userId: number;
    email: string;
    role: string;
    teamId: number | null;
  }) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to view events');
    }

    return this.prisma.event.findMany({
      where: {
        teamId: user.teamId,
        deletedAt: null,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(
    id: number,
    user: {
      userId: number;
      email: string;
      role: string;
      teamId: number | null;
    },
  ) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to view events');
    }

    const event = await this.prisma.event.findFirst({
      where: {
        id,
        teamId: user.teamId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    user: {
      userId: number;
      email: string;
      role: string;
      teamId: number | null;
    },
  ) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to update events');
    }

    const event = await this.prisma.event.findFirst({
      where: {
        id,
        teamId: user.teamId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: {
        id,
      },
      data: {
        title: updateEventDto.title,
        date: updateEventDto.date ? new Date(updateEventDto.date) : undefined,
        time: updateEventDto.time,
        location: updateEventDto.location,
        description: updateEventDto.description,
        equipmentNeeded: updateEventDto.equipmentNeeded,
      },
    });
  }

  async remove(
    id: number,
    user: {
      userId: number;
      email: string;
      role: string;
      teamId: number | null;
    },
  ) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to delete events');
    }

    const event = await this.prisma.event.findFirst({
      where: {
        id,
        teamId: user.teamId,
        deletedAt: null,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
