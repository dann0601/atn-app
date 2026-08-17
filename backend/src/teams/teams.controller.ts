import { Controller, Get, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyTeam(@CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.findMyTeam(user);
  }
}
