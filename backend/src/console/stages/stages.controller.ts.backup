/**
 * 🎭 Stages Controller - Customer Journey Management
 *
 * Controller para gestión de los 4 STAGES del customer journey
 * (BUYER → SEEKER → SOLVER → PROMOTER)
 */

import { Controller, Get, Put, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { StagesService } from './stages.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
import { UpdateStageDto } from './dto/update-stage.dto';

@Controller('console/stages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  /**
   * 📊 Get all stages with analytics
   */
  @Get()
  @Roles('admin', 'moderator')
  async getAllStages(): Promise<any> {
    return this.stagesService.getAllStages();
  }

  /**
   * 🔍 Get specific stage data
   */
  @Get(':stageId')
  @Roles('admin', 'moderator')
  async getStageById(@Param('stageId') stageId: string): Promise<any> {
    return this.stagesService.getStageById(stageId);
  }

  /**
   * ✏️ Update stage configuration
   */
  @Put(':stageId')
  @Roles('admin')
  async updateStage(
    @Param('stageId') stageId: string,
    @Body() data: UpdateStageDto
  ): Promise<any> {
    return this.stagesService.updateStage(stageId, data);
  }

  /**
   * 📈 Get stage analytics
   */
  @Get(':stageId/analytics')
  @Roles('admin', 'moderator')
  async getStageAnalytics(@Param('stageId') stageId: string): Promise<any> {
    return this.stagesService.getStageAnalytics(stageId);
  }

  /**
   * 🎯 Check user progression status
   */
  @Get('user/:userId/progression')
  @Roles('admin', 'moderator')
  async checkUserProgression(@Param('userId') userId: string): Promise<any> {
    return this.stagesService.checkUserProgression(userId);
  }

  /**
   * ⬆️ Progress user to next stage
   */
  @Post('user/:userId/progress')
  @Roles('admin')
  async progressUser(@Param('userId') userId: string): Promise<any> {
    return this.stagesService.progressUserToNextStage(userId);
  }

  /**
   * 👤 Check current user's progression (for user-facing endpoints)
   */
  @Get('me/progression')
  @Roles('user', 'admin', 'moderator')
  async checkMyProgression(@Request() req: any): Promise<any> {
    return this.stagesService.checkUserProgression(req.user.sub);
  }

  /**
   * 🚀 Progress current user to next stage (self-service)
   */
  @Post('me/progress')
  @Roles('user', 'admin', 'moderator')
  async progressMe(@Request() req: any): Promise<any> {
    return this.stagesService.progressUserToNextStage(req.user.sub);
  }
}
