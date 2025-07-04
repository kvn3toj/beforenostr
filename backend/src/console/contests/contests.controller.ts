import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ContestsService } from './contests.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';

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
  createContest(@Body() createContestDto: CreateContestDto) {
    return this.contestsService.createContest(createContestDto);
  }

  @Put(':contestId')
  updateContest(
    @Param('contestId') contestId: string,
    @Body() updateContestDto: UpdateContestDto
  ) {
    return this.contestsService.updateContest(contestId, updateContestDto);
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
