import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  // UseGuards,
} from '@nestjs/common';
import { PersonalityService } from './personality.service';
import { CreatePersonalityDto } from './dto/create-personality.dto';
import { UpdatePersonalityDto } from './dto/update-personality.dto';
import { AssignPersonalityDto } from './dto/assign-personality.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '@/rbac/guards/roles.guard';
// import { Roles } from '@/rbac/decorators/roles.decorator';
import {
  ApiTags,
  // ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('personality')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('personality')
export class PersonalityController {
  constructor(
    @Inject(PersonalityService)
    private readonly personalityService: PersonalityService
  ) {
    // //     console.log('>>> PersonalityController CONSTRUCTOR: this.personalityService IS', this.personalityService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post()
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new personality (Admin only)' })
  @ApiResponse({ status: 201, description: 'Personality created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Personality with this name already exists',
  })
  create(@Body() createPersonalityDto: CreatePersonalityDto) {
    return this.personalityService.create(createPersonalityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all personalities' })
  @ApiResponse({ status: 200, description: 'List of all personalities' })
  findAll() {
    return this.personalityService.findAll();
  }

  @Get('ping')
  @ApiOperation({ summary: 'Health check for personality module' })
  @ApiResponse({ status: 200, description: 'Personality module is working' })
  ping() {
    return {
      message: 'Personality module is working',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Simple test endpoint' })
  @ApiResponse({ status: 200, description: 'Simple test response' })
  test() {
    return {
      message: 'Test endpoint working',
      service: this.personalityService ? 'DEFINED' : 'UNDEFINED',
    };
  }

  @Get('stats')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get personality statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Personality statistics' })
  getStats() {
    return this.personalityService.getPersonalityStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a personality by ID' })
  @ApiParam({ name: 'id', description: 'Personality ID' })
  @ApiResponse({ status: 200, description: 'Personality details' })
  @ApiResponse({ status: 404, description: 'Personality not found' })
  findOne(@Param('id') id: string) {
    return this.personalityService.findOne(id);
  }

  @Get(':id/users')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get users assigned to a personality (Admin only)' })
  @ApiParam({ name: 'id', description: 'Personality ID' })
  @ApiResponse({
    status: 200,
    description: 'List of users with this personality',
  })
  getUsersByPersonality(@Param('id') id: string) {
    return this.personalityService.getUsersByPersonality(id);
  }

  @Patch(':id')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Update a personality (Admin only)' })
  @ApiParam({ name: 'id', description: 'Personality ID' })
  @ApiResponse({ status: 200, description: 'Personality updated successfully' })
  @ApiResponse({ status: 404, description: 'Personality not found' })
  @ApiResponse({
    status: 409,
    description: 'Personality with this name already exists',
  })
  update(
    @Param('id') id: string,
    @Body() updatePersonalityDto: UpdatePersonalityDto
  ) {
    return this.personalityService.update(id, updatePersonalityDto);
  }

  @Delete(':id')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Delete a personality (Admin only)' })
  @ApiParam({ name: 'id', description: 'Personality ID' })
  @ApiResponse({ status: 200, description: 'Personality deleted successfully' })
  @ApiResponse({ status: 404, description: 'Personality not found' })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete personality with assigned users',
  })
  remove(@Param('id') id: string) {
    return this.personalityService.remove(id);
  }

  @Post('assign')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Assign personality to user (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Personality assigned successfully',
  })
  @ApiResponse({ status: 404, description: 'User or personality not found' })
  assignToUser(@Body() assignPersonalityDto: AssignPersonalityDto) {
    return this.personalityService.assignToUser(assignPersonalityDto);
  }

  @Delete('user/:userId')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Remove personality from user (Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Personality removed from user successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  removeFromUser(@Param('userId') userId: string) {
    return this.personalityService.removeFromUser(userId);
  }
}
