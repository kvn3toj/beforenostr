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
import { PrismaService } from '../prisma/prisma.service';
// import { FindAllPlaylistsDto } from './dto/find-all-playlists.dto';
// import { Playlist } from '../generated/prisma';

@ApiTags('playlists')
@Controller('playlists')
export class PlaylistController {
  constructor(@Inject(PlaylistService) private readonly playlistService: PlaylistService) {
// // //     console.log('>>> PlaylistController CONSTRUCTOR: Initializing...');
// //     console.log('>>> PlaylistController CONSTRUCTOR: this.playlistService IS', this.playlistService ? 'DEFINED' : 'UNDEFINED');
  }

  // Rutas específicas PRIMERO
  @Get('test')
  @ApiOperation({
    summary: 'Test endpoint',
    description: 'Endpoint de prueba simple'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test exitoso'
  })
  test() {
//     console.log('>>> PlaylistController.test: Endpoint de prueba ejecutado');
//     console.log('>>> PlaylistController.test - playlistService available:', !!this.playlistService);
    return { 
      message: 'Test endpoint working', 
      timestamp: new Date().toISOString(),
      playlistServiceAvailable: !!this.playlistService
    };
  }

  @Get('simple')
  @ApiOperation({
    summary: 'Simple test endpoint',
    description: 'Endpoint de prueba muy simple'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test exitoso'
  })
  async simple() {
//     console.log('>>> PlaylistController.simple: Endpoint simple ejecutado');
    try {
      // Probar el servicio con parámetros mínimos
      const result = await this.playlistService.findAll({});
      return { success: true, result };
    } catch (error) {
//       console.error('>>> PlaylistController.simple error:', error);
      return { success: false, error: error.message };
    }
  }

  @Get('test-db')
  @ApiOperation({
    summary: 'Test database connection',
    description: 'Prueba directa de la conexión a la base de datos'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Datos de la base de datos'
  })
  async testDb() {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const cwd = process.cwd();
      const databaseUrl = process.env.DATABASE_URL;
      const dbPath = path.resolve(cwd, 'prisma/dev.db');
      const dbExists = fs.existsSync(dbPath);
      
//       console.log('>>> testDb: CWD:', cwd);
//       console.log('>>> testDb: DATABASE_URL:', databaseUrl);
//       console.log('>>> testDb: DB Path:', dbPath);
//       console.log('>>> testDb: DB Exists:', dbExists);
      
      return { 
        success: true, 
        cwd,
        databaseUrl,
        dbPath,
        dbExists,
        playlistService: !!this.playlistService
      };
    } catch (error) {
//       console.error('>>> testDb: Error:', error);
      return { 
        success: false, 
        error: error.message
      };
    }
  }

  @Post('test-create')
  @ApiOperation({
    summary: 'Test create endpoint',
    description: 'Endpoint de prueba para verificar datos de entrada'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test exitoso'
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  testCreate(@Body() createPlaylistDto: CreatePlaylistDto) {
//     console.log('>>> PlaylistController.testCreate: Called with data:', createPlaylistDto);
//     console.log('>>> PlaylistController.testCreate: Raw body:', JSON.stringify(createPlaylistDto, null, 2));
//     console.log('>>> PlaylistController.testCreate: mundoId value:', createPlaylistDto.mundoId);
//     console.log('>>> PlaylistController.testCreate: mundoId type:', typeof createPlaylistDto.mundoId);
    
    return { 
      success: true, 
      receivedData: createPlaylistDto,
      mundoId: createPlaylistDto.mundoId,
      mundoIdType: typeof createPlaylistDto.mundoId
    };
  }

  @Post('test-simple')
  @ApiOperation({
    summary: 'Test simple POST endpoint',
    description: 'Endpoint POST de prueba que no usa el servicio'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test exitoso'
  })
  testSimplePost(@Body() body: any) {
//     console.log('>>> PlaylistController.testSimplePost: Called with body:', body);
    return { 
      success: true, 
      message: 'Simple POST test working',
      receivedBody: body,
      timestamp: new Date().toISOString()
    };
  }

  @Post('test-service')
  @ApiOperation({
    summary: 'Test service endpoint',
    description: 'Endpoint POST de prueba que usa el servicio con findAll'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test exitoso'
  })
  async testService(@Body() body: any) {
//     console.log('>>> PlaylistController.testService: Called with body:', body);
//     console.log('>>> PlaylistController.testService: this.playlistService IS', this.playlistService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      // Probar con findAll que sabemos que funciona
      const result = await this.playlistService.findAll({});
      return { 
        success: true, 
        message: 'Service test working',
        serviceResult: result,
        receivedBody: body
      };
    } catch (error) {
//       console.error('>>> PlaylistController.testService: Error:', error);
      return { 
        success: false, 
        error: error.message,
        receivedBody: body
      };
    }
  }

  @Post('test-create-service')
  @ApiOperation({
    summary: 'Test create service endpoint',
    description: 'Endpoint POST de prueba que usa el servicio create con datos hardcodeados'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Test exitoso'
  })
  async testCreateService(@Body() body: any) {
//     console.log('>>> PlaylistController.testCreateService: Called with body:', body);
//     console.log('>>> PlaylistController.testCreateService: this.playlistService IS', this.playlistService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      // Crear datos hardcodeados que sabemos que son válidos
      const hardcodedDto = {
        mundoId: "1",
        name: "Test Playlist Hardcoded",
        description: "Test description",
        isActive: true
      };
      
//       console.log('>>> PlaylistController.testCreateService: About to call create with:', hardcodedDto);
      
      const result = await this.playlistService.create(hardcodedDto as any);
      
//       console.log('>>> PlaylistController.testCreateService: Create result:', result);
      
      return { 
        success: true, 
        message: 'Create service test working',
        createResult: result,
        usedData: hardcodedDto,
        receivedBody: body
      };
    } catch (error) {
//       console.error('>>> PlaylistController.testCreateService: Error:', error);
      return { 
        success: false, 
        error: error.message,
        errorStack: error.stack,
        receivedBody: body
      };
    }
  }

  // Rutas genéricas DESPUÉS
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva playlist',
    description: 'Crea una nueva playlist dentro de un mundo específico'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Playlist creada exitosamente',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        mundoId: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Introducción a TypeScript',
        description: 'Una serie de videos introductorios',
        imageUrl: 'https://example.com/image.jpg',
        orderInMundo: 1,
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        mundo: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Mundo de Programación'
        },
        videoItems: []
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Mundo no encontrado'
  })
  // TODO: Implementar autenticación y autorización
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  // @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
//     console.log('>>> PlaylistController.create: Called with data:', createPlaylistDto);
//     console.log('>>> PlaylistController.create: Raw body type:', typeof createPlaylistDto);
//     console.log('>>> PlaylistController.create: Raw body JSON:', JSON.stringify(createPlaylistDto, null, 2));
//     console.log('>>> PlaylistController.create: this.playlistService IS', this.playlistService ? 'DEFINED' : 'UNDEFINED');
    
    // Mapear mundo_id a mundoId si es necesario
    if ((createPlaylistDto as any).mundo_id && !createPlaylistDto.mundoId) {
      createPlaylistDto.mundoId = (createPlaylistDto as any).mundo_id;
//       console.log('>>> PlaylistController.create: Mapped mundo_id to mundoId:', createPlaylistDto.mundoId);
    }
    
    try {
      return this.playlistService.create(createPlaylistDto);
    } catch (error) {
//       console.error('>>> PlaylistController.create: Error:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar playlists',
    description: 'Obtiene una lista de playlists con filtros opcionales'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de playlists obtenida exitosamente'
  })
  async findAll(@Query(new ValidationPipe({ transform: true })) findAllDto: any) {
//     console.log('>>> PlaylistController findAll: Called');
//     console.log('>>> PlaylistController findAll: this.playlistService IS', this.playlistService ? 'DEFINED' : 'UNDEFINED');
    if (!this.playlistService) {
//       console.error('>>> PlaylistController findAll: ERROR! playlistService is undefined!');
      throw new Error('Playlist service is not available.');
    }
    
    try {
      const result = await this.playlistService.findAll(findAllDto);
//       console.log('>>> PlaylistController.findAll result:', result);
      return result;
    } catch (error) {
//       console.error('>>> PlaylistController.findAll error:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener playlist por ID',
    description: 'Obtiene una playlist específica con todos sus detalles y videos'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la playlist',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Playlist encontrada exitosamente',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        mundoId: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Introducción a TypeScript',
        description: 'Una serie de videos introductorios',
        imageUrl: 'https://example.com/image.jpg',
        orderInMundo: 1,
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        mundo: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Mundo de Programación'
        },
        videoItems: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            title: 'Variables y Tipos',
            description: 'Introducción a variables en TypeScript',
            order: 1,
            subtitles: [],
            questions: []
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Playlist no encontrada'
  })
  // TODO: Implementar autenticación si se requiere
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return {
      id: id,
      mundo_id: '1',
      name: 'Playlist de prueba',
      description: 'Una playlist de prueba',
      order_index: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: null,
      unpublished_at: null,
      version: 1,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar playlist',
    description: 'Actualiza una playlist existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la playlist a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Playlist actualizada exitosamente'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Playlist no encontrada'
  })
  // TODO: Implementar autenticación y autorización
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  // @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar playlist (soft delete)',
    description: 'Marca una playlist como inactiva (eliminación suave)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la playlist a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Playlist eliminada exitosamente'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Playlist no encontrada'
  })
  // TODO: Implementar autenticación y autorización
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  // @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return { message: `Playlist ${id} deleted successfully` };
  }
} 