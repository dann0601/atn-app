import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
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

  findAll() {
    return `This action returns all attendance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    void updateAttendanceDto;

    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
