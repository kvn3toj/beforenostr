import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, Req, Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@ApiTags('content/playlists')
@ApiBearerAuth()
@Controller('content') // Base path for content entities
export class PlaylistsController {
  constructor(@Inject(PlaylistsService) private readonly playlistsService: PlaylistsService) {
    console.log('>>> PlaylistsController CONSTRUCTOR: this.playlistsService IS', this.playlistsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('mundos/:mundoId/playlists')
  @ApiOperation({ summary: 'Get all active playlists for a specific mundo' })
  @ApiResponse({ status: 200, description: 'List of active playlists' })
  @ApiResponse({ status: 404, description: 'Mundo not found' })
  findAllActiveInMundo(@Param('mundoId') mundoId: string) {
    return this.playlistsService.findAllActiveInMundo(mundoId);
  }

  @Get('playlists/:id')
  @ApiOperation({ summary: 'Get a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist found' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  findOne(@Param('id') id: string) {
    return {
      id: id,
      mundoId: '1',
      name: 'Playlist de prueba',
      description: 'Una playlist de prueba',
      orderInMundo: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  @Get('mundos/:mundoId/playlists/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all playlists for a specific mundo (including inactive/deleted for admin)' })
  @ApiResponse({ status: 200, description: 'List of all playlists' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
   @ApiResponse({ status: 404, description: 'Mundo not found' })
  findAllInMundoAdmin(@Param('mundoId') mundoId: string) {
    return this.playlistsService.findAllInMundo(mundoId, true);
  }

  @Post('mundos/:mundoId/playlists')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new playlist for a specific mundo' })
  @ApiResponse({ status: 201, description: 'Playlist created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Mundo not found' })
  create(
    @Param('mundoId') mundoId: string,
    @Body() createPlaylistDto: CreatePlaylistDto,
  ) {
    // Ensure the mundoId from the URL matches the DTO, or use the URL param
    // For this implementation, we'll prioritize the URL parameter mundoId
    createPlaylistDto.mundoId = mundoId;
    return this.playlistsService.create(createPlaylistDto);
  }

  @Put('playlists/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(id, updatePlaylistDto);
  }

  @Delete('playlists/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Soft delete a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Playlist soft deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(id);
  }

  @Get(':id/items')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get items for a playlist' })
  findItems(@Param('id') id: string, @Req() req) {
    const isAdmin = req.user?.roles?.includes('admin');
    return this.playlistsService.findItemsByPlaylistId(id, isAdmin);
  }
} 