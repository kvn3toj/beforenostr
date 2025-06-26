import { Controller, Get, Patch, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
import { MatchService } from './match.service';
import { Request } from 'express';

class ConfirmMatchDto {
  role: 'buyer' | 'seller';
}

class SendMessageDto {
  content: string;
}

class SubmitReviewDto {
  rating: number;
  comment?: string;
  communication?: number;
  quality?: number;
  delivery?: number;
  value?: number;
}

interface AuthRequest extends Request {
  user?: { id: string };
}

@Controller('marketplace/match')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'USER')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':matchId')
  async getMatch(@Param('matchId') matchId: string, @Req() req: AuthRequest) {
    return this.matchService.getMatch(matchId, req.user!.id);
  }

  @Patch(':matchId/confirm')
  async confirmMatch(
    @Param('matchId') matchId: string,
    @Body() dto: ConfirmMatchDto,
    @Req() req: AuthRequest
  ) {
    return this.matchService.confirmMatch(matchId, req.user!.id, dto.role);
  }

  @Get(':matchId/messages')
  async getMessages(@Param('matchId') matchId: string, @Req() req: AuthRequest) {
    return this.matchService.getMessages(matchId, req.user!.id);
  }

  @Post(':matchId/messages')
  async sendMessage(
    @Param('matchId') matchId: string,
    @Body() dto: SendMessageDto,
    @Req() req: AuthRequest
  ) {
    return this.matchService.sendMessage(matchId, req.user!.id, dto.content);
  }

  @Get(':matchId/review')
  async getReview(@Param('matchId') matchId: string, @Req() req: AuthRequest) {
    return this.matchService.getReview(matchId, req.user!.id);
  }

  @Post(':matchId/review')
  async submitReview(
    @Param('matchId') matchId: string,
    @Body() dto: SubmitReviewDto,
    @Req() req: AuthRequest
  ) {
    return this.matchService.submitReview(matchId, req.user!.id, dto);
  }
}
