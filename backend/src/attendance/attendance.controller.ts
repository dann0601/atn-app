import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    email: string;
    role: string;
    teamId: number | null;
  };
};

@Controller('events/:eventId/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.attendanceService.create(
      +eventId,
      createAttendanceDto,
      request.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('eventId') eventId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.attendanceService.findAll(+eventId, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('users/:userId')
  assignUser(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.attendanceService.assignUser(+eventId, +userId, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.attendanceService.findOne(+eventId, +id, request.user);
  }
}
