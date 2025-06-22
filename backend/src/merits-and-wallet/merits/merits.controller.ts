import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MeritsService } from './merits.service';
import { CreateMeritDto } from './dto/create-merit.dto';
import { UpdateMeritDto } from './dto/update-merit.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Assuming this path
import { RolesGuard } from '@/rbac/guards/roles.guard'; // Assuming this path
import { Roles } from '@/rbac/decorators/roles.decorator'; // Assuming this path

@ApiTags('merits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('merits')
export class MeritsController {
  constructor(private readonly meritsService: MeritsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new merit type (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The merit has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createMeritDto: CreateMeritDto) {
    return this.meritsService.create(createMeritDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all merit types (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all merits.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.meritsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a merit type by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'The found merit.' })
  @ApiResponse({ status: 404, description: 'Merit not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.meritsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a merit type by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'The updated merit.' })
  @ApiResponse({ status: 404, description: 'Merit not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateMeritDto: UpdateMeritDto) {
    return this.meritsService.update(id, updateMeritDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a merit type by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'The deleted merit.' })
  @ApiResponse({ status: 404, description: 'Merit not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.meritsService.remove(id);
  }
}
