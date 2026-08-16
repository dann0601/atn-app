import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceMarkedBy } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    eventId: number,
    createAttendanceDto: CreateAttendanceDto,
    user: {
      userId: number;
      email: string;
      role: string;
      teamId: number | null;
    },
  ) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to mark attendance');
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

    return this.prisma.eventAttendance.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: user.userId,
        },
      },
      update: {
        status: createAttendanceDto.status,
        markedBy: AttendanceMarkedBy.self,
      },
      create: {
        eventId,
        userId: user.userId,
        status: createAttendanceDto.status,
        markedBy: AttendanceMarkedBy.self,
      },
    });
  }

  async findAll(
    eventId: number,
    user: {
      userId: number;
      email: string;
      role: string;
      teamId: number | null;
    },
  ) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to view attendance');
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

    return this.prisma.eventAttendance.findMany({
      where: {
        eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });
  }

  async findOne(
    eventId: number,
    id: number,
    user: {
      userId: number;
      email: string;
      role: string;
      teamId: number | null;
    },
  ) {
    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to view attendance');
    }

    const attendance = await this.prisma.eventAttendance.findFirst({
      where: {
        id,
        eventId,
        event: {
          teamId: user.teamId,
          deletedAt: null,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    return attendance;
  }
}
