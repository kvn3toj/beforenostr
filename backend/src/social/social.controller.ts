import { Controller, Get, Post, Body, Param, Req, UseGuards, Inject, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialService } from './social.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('social')
export class SocialController {
  constructor(@Inject(SocialService) private readonly socialService: SocialService) {
    console.log('>>> SocialController CONSTRUCTOR: this.socialService IS', this.socialService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('stats')
  async getSocialStats() {
    console.log('>>> SocialController.getSocialStats: Starting...');
    return this.socialService.getSocialStats();
  }

  @Get('activity/recent')
  async getRecentActivity() {
    console.log('>>> SocialController.getRecentActivity: Starting...');
    return this.socialService.getRecentActivity();
  }

  @Get('publications')
  async getPublications() {
    console.log('>>> SocialController.getPublications: Starting...');
    return this.socialService.findAllPublications();
  }

  @Post('publications')
  @UseGuards(JwtAuthGuard)
  async createPublication(@Body() dto: CreatePublicationDto, @Req() req: any) {
    console.log('>>> SocialController.createPublication: Starting...', { dto, userId: req.user?.id });
    return this.socialService.createPublication(dto, req.user.id);
  }

  @Post('publications/:id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@Param('id') publicationId: string, @Req() req: any) {
    console.log('>>> SocialController.toggleLike: Starting...', { publicationId, userId: req.user?.id });
    return this.socialService.toggleLike(publicationId, req.user.id);
  }

  @Post('publications/:id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(@Param('id') publicationId: string, @Body() dto: CreateCommentDto, @Req() req: any) {
    console.log('>>> SocialController.createComment: Starting...', { publicationId, dto, userId: req.user?.id });
    return this.socialService.createComment(publicationId, dto, req.user.id);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') commentId: string, @Req() req: any) {
    console.log('>>> SocialController.deleteComment: Starting...', { commentId, userId: req.user?.id });
    return this.socialService.deleteComment(commentId, req.user.id);
  }
} 