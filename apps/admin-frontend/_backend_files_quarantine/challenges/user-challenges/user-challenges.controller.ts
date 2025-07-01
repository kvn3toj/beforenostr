import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, ForbiddenException, Query } from '@nestjs/common';
import { UserChallengesService } from './user-challenges.service';
import { UpdateUserChallengeDto } from './dto/update-user-challenge.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Adjust path as necessary
import { RolesGuard } from '../../rbac/guards/roles.guard'; // Adjust path as necessary
import { Roles } from '../../rbac/decorators/roles.decorator'; // Adjust path as necessary
import { Request } from 'express';
import { UserChallengeStatus } from '@prisma/client'; // Assuming UserChallengeStatus enum

// Define a basic type for the authenticated user
interface AuthenticatedRequest extends Request {
    user: { id: string; roles: string[]; /* other user properties */ };
}

@ApiTags('user-challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-challenges')
export class UserChallengesController {
  constructor(private readonly userChallengesService: UserChallengesService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new challenge' })
  @ApiResponse({ status: 201, description: 'User challenge started successfully.' })
  @ApiResponse({ status: 409, description: 'User already started this challenge.' })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  @ApiBody({ schema: { type: 'object', properties: { challengeId: { type: 'string' } } } })
  async startChallenge(@Req() req: AuthenticatedRequest, @Body('challengeId') challengeId: string) {
    // TODO: Add RBAC or logic to ensure user can start this specific challenge type/status
    return this.userChallengesService.startChallenge(req.user.id, challengeId);
  }

  @Patch(':userChallengeId/progress')
  @ApiOperation({ summary: 'Update progress for a user challenge (Owner or Admin only)' })
  @ApiResponse({ status: 200, description: 'User challenge progress updated.' })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'userChallengeId', description: 'ID of the user challenge instance' })
  async updateProgress(
    @Req() req: AuthenticatedRequest,
    @Param('userChallengeId') userChallengeId: string,
    @Body() updateUserChallengeDto: UpdateUserChallengeDto,
  ) {
      // Ownership check is now handled within the service method
    return this.userChallengesService.updateProgress(req.user, userChallengeId, updateUserChallengeDto);
  }

  @Post(':userChallengeId/complete')
  @ApiOperation({ summary: 'Mark a user challenge as complete and award rewards (Owner or Admin only)' })
  @ApiResponse({ status: 200, description: 'User challenge completed and rewards awarded.' })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({ status: 409, description: 'Challenge already completed or requirements not met.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiParam({ name: 'userChallengeId', description: 'ID of the user challenge instance' })
  async completeChallenge(
    @Req() req: AuthenticatedRequest,
    @Param('userChallengeId') userChallengeId: string,
  ) {
      // Ownership check is now handled within the service method
    return this.userChallengesService.completeChallenge(req.user, userChallengeId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all user challenges for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user challenges for the current user.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  findMyChallenges(@Req() req: AuthenticatedRequest) {
    return this.userChallengesService.findUserChallenges(req.user.id);
  }

  @Get(':userChallengeId')
  @ApiOperation({ summary: 'Get a specific user challenge instance by ID (Owner or Admin only)' })
  @ApiResponse({ status: 200, description: 'The user challenge details.' })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
   @ApiParam({ name: 'userChallengeId', description: 'ID of the user challenge instance' })
  async findOneUserChallenge(@Req() req: AuthenticatedRequest, @Param('userChallengeId') userChallengeId: string) {
      // Ownership check is now handled within the service method
      return this.userChallengesService.findOneUserChallenge(req.user, userChallengeId);
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/all')
  @ApiOperation({ summary: '[ADMIN] Get all user challenges' })
  @ApiResponse({ status: 200, description: 'List of all user challenges (Admin only).' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiQuery({ name: 'status', required: false, enum: UserChallengeStatus })
  findAllAdmin(@Query('status') status?: UserChallengeStatus) {
      return this.userChallengesService.findAllUserChallengesAdmin(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/:userChallengeId')
   @ApiOperation({ summary: '[ADMIN] Get a specific user challenge instance by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'The user challenge details (Admin only).' })
  @ApiResponse({ status: 404, description: 'User challenge not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
   @ApiParam({ name: 'userChallengeId', description: 'ID of the user challenge instance' })
  findOneAdmin(@Param('userChallengeId') userChallengeId: string) {
      return this.userChallengesService.findOneUserChallengeAdmin(userChallengeId);
  }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Patch('/admin/:userChallengeId/progress')
   @ApiOperation({ summary: '[ADMIN] Update progress for any user challenge (Admin only)' })
   @ApiResponse({ status: 200, description: 'User challenge progress updated (Admin only).' })
   @ApiResponse({ status: 404, description: 'User challenge not found.' })
   @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiParam({ name: 'userChallengeId', description: 'ID of the user challenge instance' })
   updateProgressAdmin(
     @Param('userChallengeId') userChallengeId: string,
     @Body() updateUserChallengeDto: UpdateUserChallengeDto,
   ) {
       // No ownership check needed for admin routes, pass a dummy user or a specific flag if service requires it
       // Assuming service methods are overloaded or can handle a flag, or we call specific admin service methods
       // As per service modifications, using specific admin methods where provided
       // If no specific admin update method, can pass a user object indicating admin role
        const adminUser = { id: 'admin', roles: ['admin'] }; // Dummy admin user representation
        return this.userChallengesService.updateProgress(adminUser, userChallengeId, updateUserChallengeDto);
   }

   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Post('/admin/:userChallengeId/complete')
   @ApiOperation({ summary: '[ADMIN] Mark any user challenge as complete and award rewards (Admin only)' })
   @ApiResponse({ status: 200, description: 'User challenge completed and rewards awarded (Admin only).' })
   @ApiResponse({ status: 404, description: 'User challenge not found.' })
   @ApiResponse({ status: 409, description: 'Challenge already completed or requirements not met.' })
   @ApiResponse({ status: 403, description: 'Forbidden resource.' })
    @ApiParam({ name: 'userChallengeId', description: 'ID of the user challenge instance' })
   completeChallengeAdmin(
     @Param('userChallengeId') userChallengeId: string,
   ) {
       // No ownership check needed for admin routes
        const adminUser = { id: 'admin', roles: ['admin'] }; // Dummy admin user representation
       return this.userChallengesService.completeChallenge(adminUser, userChallengeId);
   }
} 