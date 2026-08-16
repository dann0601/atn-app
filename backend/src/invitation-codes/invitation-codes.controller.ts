import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InvitationCodesService } from './invitation-codes.service';
import { CreateInvitationCodeDto } from './dto/create-invitation-code.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { UserRole } from '../generated/prisma/enums';

@Controller('invitation-codes')
export class InvitationCodesController {
  constructor(private readonly invitationCodesService: InvitationCodesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.super_admin)
  @Post()
  create(
    @Body() createInvitationCodeDto: CreateInvitationCodeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invitationCodesService.create(createInvitationCodeDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.super_admin)
  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.invitationCodesService.findAll(user);
  }
}
