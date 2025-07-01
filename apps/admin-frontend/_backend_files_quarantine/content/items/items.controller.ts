import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../rbac/guards/roles.guard';
import { Roles } from '../../../rbac/decorators/roles.decorator';
import { ItemsService } from './items.service';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';

@ApiTags('content/items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('content') // Base path for content entities
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('playlists/:playlistId/items')
  @ApiOperation({ summary: 'Get all active content items for a specific playlist' })
  @ApiResponse({ status: 200, description: 'List of active content items' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  findAllActiveInPlaylist(@Param('playlistId') playlistId: string) {
    return this.itemsService.findAllActiveInPlaylist(playlistId);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get a content item by ID' })
  @ApiResponse({ status: 200, description: 'Content item found' })
  @ApiResponse({ status: 404, description: 'Content item not found' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Get('playlists/:playlistId/items/admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all content items for a specific playlist (including inactive/deleted for admin)' })
  @ApiResponse({ status: 200, description: 'List of all content items' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  findAllInPlaylistAdmin(@Param('playlistId') playlistId: string) {
    return this.itemsService.findAllInPlaylist(playlistId, true);
  }

  @Post('playlists/:playlistId/items')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new content item for a specific playlist' })
  @ApiResponse({ status: 201, description: 'Content item created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Playlist or Item Type not found' })
  create(
    @Param('playlistId') playlistId: string,
    @Body() createContentItemDto: CreateContentItemDto,
  ) {
    // Ensure the playlistId from the URL matches the DTO, or use the URL param
    // For this implementation, we'll prioritize the URL parameter playlistId
    createContentItemDto.playlistId = playlistId;
    return this.itemsService.create(createContentItemDto);
  }

  @Put('items/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a content item by ID' })
  @ApiResponse({ status: 200, description: 'Content item updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Content item, Playlist or Item Type not found' })
  update(
    @Param('id') id: string,
    @Body() updateContentItemDto: UpdateContentItemDto,
  ) {
    return this.itemsService.update(id, updateContentItemDto);
  }

  @Delete('items/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Soft delete a content item by ID' })
  @ApiResponse({ status: 200, description: 'Content item soft deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Content item not found' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
} 