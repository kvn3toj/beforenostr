import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
import { MatchService } from './match.service';
import { ConfirmMatchDto } from './dto/confirm-match.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: { id: string };
}

@Controller('marketplace/match')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'USER')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':id')
  @ApiExcludeEndpoint()
  async getMatch(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.matchService.getMatch(id, req.user?.id);
  }

  @Patch(':id/confirm')
  @ApiExcludeEndpoint()
  async confirmMatch(
    @Param('id') id: string,
    @Body() confirmMatchDto: ConfirmMatchDto,
    @Req() req: AuthRequest,
  ) {
    return this.matchService.confirmMatch(id, req.user?.id, confirmMatchDto.role);
  }

  @Get(':matchId/messages')
  async getMessages(
    @Param('matchId') matchId: string,
    @Req() req: AuthRequest
  ) {
    return this.matchService.getMessages(matchId, req.user!.id);
  }

  @Post(':id/message')
  @ApiExcludeEndpoint()
  async sendMessage(
    @Param('id') id: string,
    @Body() sendMessageDto: SendMessageDto,
    @Req() req: AuthRequest,
  ) {
    return this.matchService.sendMessage(id, req.user?.id, sendMessageDto.content);
  }

  @Get(':matchId/review')
  async getReview(@Param('matchId') matchId: string, @Req() req: AuthRequest) {
    return this.matchService.getReview(matchId, req.user!.id);
  }

  @Post(':id/review')
  @ApiExcludeEndpoint()
  async submitReview(
    @Param('id') id: string,
    @Body() submitReviewDto: SubmitReviewDto,
    @Req() req: AuthRequest,
  ) {
    return this.matchService.submitReview(id, req.user?.id, submitReviewDto);
  }
}
