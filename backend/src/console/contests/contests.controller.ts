import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';

@Controller('console/contests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Get()
  getAllContests() {
    return this.contestsService.getAllContests();
  }

  @Get(':contestId')
  getContestById(@Param('contestId') contestId: string) {
    return this.contestsService.getContestById(contestId);
  }

  @Post()
  createContest(@Body() data: any) {
    return this.contestsService.createContest(data);
  }

  @Put(':contestId')
  updateContest(@Param('contestId') contestId: string, @Body() data: any) {
    return this.contestsService.updateContest(contestId, data);
  }

  @Get(':contestId/leaderboard')
  getContestLeaderboard(@Param('contestId') contestId: string) {
    return this.contestsService.getContestLeaderboard(contestId);
  }

  @Get(':contestId/analytics')
  getContestAnalytics(@Param('contestId') contestId: string) {
    return this.contestsService.getContestAnalytics(contestId);
  }
}