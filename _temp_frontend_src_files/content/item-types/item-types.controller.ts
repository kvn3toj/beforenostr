import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { ItemTypesService } from './item-types.service';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('content/item-types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('content/item-types')
export class ItemTypesController {
  constructor(private readonly itemTypesService: ItemTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all item types' })
  @ApiResponse({ status: 200, description: 'List of item types' })
  findAll() {
    return this.itemTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item type by ID' })
  @ApiResponse({ status: 200, description: 'Item type found' })
  @ApiResponse({ status: 404, description: 'Item type not found' })
  findOne(@Param('id') id: string) {
    return this.itemTypesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new item type (Admin only)' })
  @ApiResponse({ status: 201, description: 'Item type created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  create(@Body() createItemTypeDto: CreateItemTypeDto) {
    return this.itemTypesService.create(createItemTypeDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update an item type by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Item type updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Item type not found' })
  update(@Param('id') id: string, @Body() updateItemTypeDto: UpdateItemTypeDto) {
    return this.itemTypesService.update(id, updateItemTypeDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Soft delete an item type by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Item type soft deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Item type not found' })
  remove(@Param('id') id: string) {
    return this.itemTypesService.remove(id);
  }
} 