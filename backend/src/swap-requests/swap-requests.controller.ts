import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SwapRequestsService } from './swap-requests.service';
import { CreateSwapRequestDto } from './dto/create-swap-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('events/:eventId/swap-requests')
export class SwapRequestsController {
  constructor(private readonly swapRequestsService: SwapRequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createSwapRequestDto: CreateSwapRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.swapRequestsService.create(
      +eventId,
      createSwapRequestDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('eventId') eventId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.swapRequestsService.findAll(+eventId, user);
  }
}
