import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';
import { Request } from 'express';
import { AuthenticatedUser } from '../../types/auth.types';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@ApiTags('admin/config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new application configuration setting (Admin only)',
  })
  @ApiResponse({ status: 201, description: 'Configuration setting created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createConfigDto: CreateConfigDto
  ) {
    return this.configService.create(createConfigDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all application configuration settings (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'List of configuration settings.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  findAll() {
    return this.configService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific configuration setting by ID (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Configuration setting details.' })
  @ApiResponse({ status: 404, description: 'Config not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  findOne(@Param('id') id: string) {
    return this.configService.findOne(id);
  }

  @Get('key/:key')
  @ApiOperation({
    summary: 'Get a specific configuration setting by Key (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Configuration setting details.' })
  @ApiResponse({ status: 404, description: 'Config not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  async findOneByKey(@Param('key') key: string) {
    const config = await this.configService.findOneByKey(key);
    if (!config) {
      throw new NotFoundException(`Config with key ${key} not found`);
    }
    return config;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a configuration setting by ID (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated configuration setting.',
  })
  @ApiResponse({ status: 404, description: 'Config not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateConfigDto: UpdateConfigDto
  ) {
    return this.configService.update(id, updateConfigDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a configuration setting by ID (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration setting successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Config not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.configService.remove(id, req.user);
  }
}
