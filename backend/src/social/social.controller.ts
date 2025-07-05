import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Inject,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js.js';
import { SocialService } from './social.service.js.js';
import { CreatePublicationDto } from './dto/create-publication.dto.js.js';
import { CreateCommentDto } from './dto/create-comment.dto.js.js';

interface AuthenticatedUser {
  id: string;
  // Add other user properties if available and needed
}

@Controller('social')
export class SocialController {
  constructor(
    @Inject(SocialService) private readonly socialService: SocialService
  ) {}

  @Get('stats')
  async getSocialStats() {
    return this.socialService.getSocialStats();
  }

  @Get('activity/recent')
  async getRecentActivity() {
    return this.socialService.getRecentActivity();
  }

  @Get('publications')
  async getPublications() {
    return this.socialService.findAllPublications();
  }

  @Post('publications')
  @UseGuards(JwtAuthGuard)
  async createPublication(
    @Body() dto: CreatePublicationDto,
    @Req() req: Request & { user: AuthenticatedUser }
  ) {
    return this.socialService.createPublication(dto, req.user.id);
  }

  @Post('publications/:id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @Param('id') publicationId: string,
    @Req() req: Request & { user: AuthenticatedUser }
  ) {
    return this.socialService.toggleLike(publicationId, req.user.id);
  }

  @Post('publications/:id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') publicationId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request & { user: AuthenticatedUser }
  ) {
    return this.socialService.createComment(publicationId, dto, req.user.id);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') commentId: string,
    @Req() req: Request & { user: AuthenticatedUser }
  ) {
    return this.socialService.deleteComment(commentId, req.user.id);
  }
}
