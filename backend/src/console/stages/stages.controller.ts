/**
 * 🎭 Stages Controller - Customer Journey Management
 *
 * Controller para gestión de los 4 STAGES del customer journey
 * (BUYER → SEEKER → SOLVER → PROMOTER)
 */

import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { StagesService } from './stages.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
import { UpdateStageDto } from './dto/update-stage.dto';

@Controller('console/stages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Get()
  async getAllStages() {
    return this.stagesService.getAllStages();
  }

  @Get(':stageId')
  async getStageById(@Param('stageId') stageId: string) {
    return this.stagesService.getStageById(stageId);
  }

  @Put(':stageId')
  async updateStage(
    @Param('stageId') stageId: string,
    @Body() data: UpdateStageDto
  ) {
    return this.stagesService.updateStage(stageId, data);
  }

  @Get(':stageId/analytics')
  async getStageAnalytics(@Param('stageId') stageId: string) {
    return this.stagesService.getStageAnalytics(stageId);
  }
}
