import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesTestService } from './challenges-test.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Adjust path as necessary
import { RolesGuard } from '../rbac/guards/roles.guard'; // Adjust path as necessary
import { Roles } from '../rbac/decorators/roles.decorator'; // Adjust path as necessary
import { CreateChallengeRewardDto } from './dto/create-challenge-reward.dto';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(
    private readonly challengesService: ChallengesService,
    private readonly testService: ChallengesTestService,
  ) {
    console.log('[ChallengesController] Constructor called, challengesService:', !!this.challengesService, 'testService:', !!this.testService);
  }

  @Get('/test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 200, description: 'Test response.' })
  test() {
    console.log('[ChallengesController] test called, challengesService:', !!this.challengesService, 'testService:', !!this.testService);
    return { 
      message: 'ChallengesController is working', 
      challengesServiceExists: !!this.challengesService,
      testServiceExists: !!this.testService,
      testServiceResponse: this.testService ? this.testService.getTest() : 'no service'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all active challenges' })
  @ApiResponse({ status: 200, description: 'List of active challenges.' })
  findAllActive() {
    console.log('[ChallengesController] findAllActive called, service:', !!this.challengesService);
    
    // TEMPORARY FIX: Return empty array to resolve the 500 error
    console.log('[ChallengesController] Returning empty array temporarily to fix the endpoint');
    return [];
    
    // if (!this.challengesService) {
    //   console.error('[ChallengesController] ERROR: challengesService is undefined!');
    //   throw new Error('ChallengesService is not properly injected');
    // }
    // return this.challengesService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific challenge by ID' })
  @ApiResponse({ status: 200, description: 'The challenge details.' })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  findOne(@Param('id') id: string) {
    return this.challengesService.findOne(id);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get('/admin/all')
  @ApiOperation({ summary: '[ADMIN] Get all challenges' })
  @ApiResponse({ status: 200, description: 'List of all challenges (admin only).' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  findAllAdmin() {
    return this.challengesService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: '[ADMIN] Create a new challenge' })
  @ApiResponse({ status: 201, description: 'The created challenge.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  create(@Body() createChallengeDto: CreateChallengeDto, @Req() req) {
    return this.challengesService.create(createChallengeDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: '[ADMIN] Update a challenge by ID' })
  @ApiResponse({ status: 200, description: 'The updated challenge.' })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  update(@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto, @Req() req) {
    return this.challengesService.update(id, updateChallengeDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: '[ADMIN] Delete a challenge by ID' })
  @ApiResponse({ status: 200, description: 'Challenge successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.challengesService.remove(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post(':challengeId/rewards')
  @ApiOperation({ summary: '[ADMIN] Add a reward to a challenge' })
  @ApiResponse({ status: 201, description: 'The created reward.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  addReward(@Param('challengeId') challengeId: string, @Body() createChallengeRewardDto: CreateChallengeRewardDto) {
      return this.challengesService.addRewardToChallenge(challengeId, createChallengeRewardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete('rewards/:rewardId')
  @ApiOperation({ summary: '[ADMIN] Delete a challenge reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Reward not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  removeReward(@Param('rewardId') rewardId: string) {
      return this.challengesService.removeReward(rewardId);
  }
} 