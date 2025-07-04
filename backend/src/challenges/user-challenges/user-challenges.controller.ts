import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserChallengesService } from './user-challenges.service';
import { UpdateUserChallengeDto } from './dto/update-user-challenge.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Adjust path as necessary
import { RolesGuard } from '@/rbac/guards/roles.guard'; // Adjust path as necessary
import { Roles } from '@/rbac/decorators/roles.decorator'; // Adjust path as necessary
import { Request } from 'express';
import { AuthenticatedUser } from 'src/types/auth.types';

// Updated interface to include email
interface AuthenticatedRequest extends Request {
  user: { id: string; roles: string[]; email: string };
}

@ApiTags('user-challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-challenges')
export class UserChallengesController {
  constructor(private readonly userChallengesService: UserChallengesService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new challenge' })
  @ApiResponse({
    status: 201,
    description: 'User challenge started successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'User already started this challenge.',
  })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  @ApiBody({
    schema: { type: 'object', properties: { challengeId: { type: 'string' } } },
  })
  async startChallenge(
    @Req() req: AuthenticatedRequest,
    @Body('challengeId') challengeId: string
  ) {
    const user: AuthenticatedUser = req.user;
    return this.userChallengesService.startChallenge(
      user.id,
      challengeId,
      user
    );
  }

  @Patch(':userChallengeId/progress')
  @ApiOperation({
    summary: 'Update progress for a user challenge (Owner or Admin only)',
  })
  @ApiResponse({ status: 200, description: 'User challenge progress updated.' })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({
    name: 'userChallengeId',
    description: 'ID of the user challenge instance',
  })
  async updateProgress(
    @Req() req: AuthenticatedRequest,
    @Param('userChallengeId') userChallengeId: string,
    @Body() updateUserChallengeDto: UpdateUserChallengeDto
  ) {
    const user: AuthenticatedUser = req.user;
    return this.userChallengesService.updateProgress(
      user,
      userChallengeId,
      updateUserChallengeDto
    );
  }

  @Post(':userChallengeId/complete')
  @ApiOperation({
    summary:
      'Mark a user challenge as complete and award rewards (Owner or Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User challenge completed and rewards awarded.',
  })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({
    status: 409,
    description: 'Challenge already completed or requirements not met.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({
    name: 'userChallengeId',
    description: 'ID of the user challenge instance',
  })
  async completeChallenge(
    @Req() req: AuthenticatedRequest,
    @Param('userChallengeId') userChallengeId: string
  ) {
    const user: AuthenticatedUser = req.user;
    return this.userChallengesService.completeChallenge(user, userChallengeId);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get all user challenges for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user challenges for the current user.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  findMyChallenges(@Req() req: AuthenticatedRequest) {
    return this.userChallengesService.findUserChallenges(req.user.id);
  }

  @Get(':userChallengeId')
  @ApiOperation({
    summary:
      'Get a specific user challenge instance by ID (Owner or Admin only)',
  })
  @ApiResponse({ status: 200, description: 'The user challenge details.' })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({
    name: 'userChallengeId',
    description: 'ID of the user challenge instance',
  })
  async findOneUserChallenge(
    @Req() req: AuthenticatedRequest,
    @Param('userChallengeId') userChallengeId: string
  ) {
    const user: AuthenticatedUser = req.user;
    return this.userChallengesService.findOneUserChallenge(
      user,
      userChallengeId
    );
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/all')
  @ApiOperation({ summary: '[ADMIN] Get all user challenges' })
  @ApiResponse({
    status: 200,
    description: 'List of all user challenges (Admin only).',
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiQuery({ name: 'status', required: false, type: 'string' }) // Use string type for query param
  findAllAdmin(@Query('status') status?: string) {
    return this.userChallengesService.findAllUserChallengesAdmin(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/:userChallengeId')
  @ApiOperation({
    summary:
      '[ADMIN] Get a specific user challenge instance by ID (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'The user challenge details (Admin only).',
  })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({
    name: 'userChallengeId',
    description: 'ID of the user challenge instance',
  })
  findOneAdmin(@Param('userChallengeId') userChallengeId: string) {
    return this.userChallengesService.findOneUserChallengeAdmin(
      userChallengeId
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('/admin/:userChallengeId/progress')
  @ApiOperation({
    summary: '[ADMIN] Update progress for any user challenge (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User challenge progress updated (Admin only).',
  })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({
    name: 'userChallengeId',
    description: 'ID of the user challenge instance',
  })
  updateProgressAdmin(
    @Param('userChallengeId') userChallengeId: string,
    @Body() updateUserChallengeDto: UpdateUserChallengeDto
  ) {
    const adminUser: AuthenticatedUser = {
      id: 'admin',
      roles: ['admin'],
      email: 'admin@gamifier.com',
    };
    return this.userChallengesService.updateProgress(
      adminUser,
      userChallengeId,
      updateUserChallengeDto
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('/admin/:userChallengeId/complete')
  @ApiOperation({
    summary:
      '[ADMIN] Mark any user challenge as complete and award rewards (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User challenge completed and rewards awarded (Admin only).',
  })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({
    status: 409,
    description: 'Challenge already completed or requirements not met.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({
    name: 'userChallengeId',
    description: 'ID of the user challenge instance',
  })
  completeChallengeAdmin(@Param('userChallengeId') userChallengeId: string) {
    const adminUser: AuthenticatedUser = {
      id: 'admin',
      roles: ['admin'],
      email: 'admin@gamifier.com',
    };
    return this.userChallengesService.completeChallenge(
      adminUser,
      userChallengeId
    );
  }
}
