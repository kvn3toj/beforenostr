import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { FindAllPlaylistsDto } from './dto/find-all-playlists.dto';
// import { Playlist } from '../generated/prisma';

@ApiTags('playlists')
@Controller('playlists')
@ApiBearerAuth()
export class PlaylistController {
  constructor(
    @Inject(PlaylistService) private readonly playlistService: PlaylistService
  ) {
    // // //     console.log('>>> PlaylistController CONSTRUCTOR: Initializing...');
    // //     console.log('>>> PlaylistController CONSTRUCTOR: this.playlistService IS', this.playlistService ? 'DEFINED' : 'UNDEFINED');
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva playlist',
    description: 'Crea una nueva playlist dentro de un mundo específico',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'La playlist ha sido creada exitosamente',
    type: CreatePlaylistDto, // Assuming the response shape matches the DTO
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    //     console.log('>>> PlaylistController.create: Called with data:', createPlaylistDto);
    //     console.log('>>> PlaylistController.create: Raw body type:', typeof createPlaylistDto);
    //     console.log('>>> PlaylistController.create: Raw body JSON:', JSON.stringify(createPlaylistDto, null, 2));
    //     console.log('>>> PlaylistController.create: this.playlistService IS', this.playlistService ? 'DEFINED' : 'UNDEFINED');

    // Mapear mundo_id a mundoId si es necesario
    if (createPlaylistDto.mundo_id && !createPlaylistDto.mundoId) {
      createPlaylistDto.mundoId = createPlaylistDto.mundo_id;
      //       console.log('>>> PlaylistController.create: Mapped mundo_id to mundoId:', createPlaylistDto.mundoId);
    }

    return this.playlistService.create(createPlaylistDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las playlists',
    description:
      'Obtiene un listado de todas las playlists con opciones de paginación y filtrado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de playlists obtenido exitosamente',
  })
  async findAll(
    @Query(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    findAllDto: FindAllPlaylistsDto
  ) {
    //     console.log('>>> PlaylistController findAll: Called');
    //     console.log('>>> PlaylistController findAll: this.playlistService IS', this.playlistService ? 'DEFINED' : 'UNDEFINED');
    if (!this.playlistService) {
      //       console.error('>>> PlaylistController findAll: ERROR! playlistService is undefined!');
      throw new Error('Playlist service is not available.');
    }

    const result = await this.playlistService.findAll(findAllDto);
    //       console.log('>>> PlaylistController.findAll result:', result);
    return result;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una playlist por ID',
    description: 'Obtiene los detalles de una playlist específica por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID de la playlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Playlist encontrada',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Playlist no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una playlist',
    description: 'Actualiza los datos de una playlist existente',
  })
  @ApiParam({ name: 'id', description: 'ID de la playlist a actualizar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Playlist actualizada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Playlist no encontrada',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto
  ) {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una playlist',
    description: 'Elimina una playlist existente por su ID',
  })
  @ApiParam({ name: 'id', description: 'ID de la playlist a eliminar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Playlist eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Playlist no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.playlistService.remove(id);
  }
}
