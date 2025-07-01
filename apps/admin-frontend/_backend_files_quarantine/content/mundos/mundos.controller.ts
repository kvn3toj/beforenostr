import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, Req, Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';
import { MundosService } from './mundos.service';
import { CreateMundoDto } from './dto/create-mundo.dto';
import { UpdateMundoDto } from './dto/update-mundo.dto';

@ApiTags('content/mundos')
@ApiBearerAuth()
@Controller(['content/mundos', 'mundos']) // Support both routes
export class MundosController {
  constructor(@Inject(MundosService) private readonly mundosService: MundosService) {
    console.log('MundosController constructor - service:', this.mundosService);
    console.log('MundosController constructor - service type:', typeof this.mundosService);
    console.log('MundosController constructor - service constructor:', this.mundosService?.constructor?.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active mundos' })
  @ApiResponse({ status: 200, description: 'List of active mundos' })
  async findAllActive() {
    try {
      console.log('MundosController.findAllActive - service check:', !!this.mundosService);
      if (!this.mundosService) {
        console.error('MundosController.findAllActive - Service is undefined!');
        throw new Error('MundosService is not available');
      }
      
      // Usar el servicio real para obtener datos de la base de datos
      const mundos = await this.mundosService.findAllActive();
      console.log('MundosController.findAllActive - mundos from DB:', mundos);
      return mundos;
    } catch (error) {
      console.error('MundosController.findAllActive - Error:', error);
      // Fallback a datos estáticos si hay error
      return [
        {
          id: '1',
          name: 'Mundo de Programación',
          description: 'Aprende programación desde cero',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Mundo de Diseño',
          description: 'Diseño gráfico y UI/UX',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  test() {
    return { message: 'Mundos controller is working' };
  }

  @Get('simple')
  @ApiOperation({ summary: 'Simple test without database' })
  simple() {
    return [
      { id: '1', name: 'Mundo de Programación', description: 'Aprende programación desde cero' },
      { id: '2', name: 'Mundo de Diseño', description: 'Diseño gráfico y UI/UX' }
    ];
  }

  @Get('db-test')
  @ApiOperation({ summary: 'Test database connection' })
  async dbTest() {
    try {
      console.log('MundosController.dbTest - service check:', !!this.mundosService);
      if (!this.mundosService) {
        return { success: false, error: 'MundosService is not available' };
      }
      
      const result = await this.mundosService.testConnection();
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all mundos (including inactive/deleted for admin)' })
  @ApiResponse({ status: 200, description: 'List of all mundos' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async findAllAdmin() {
    try {
      if (!this.mundosService) {
        throw new Error('MundosService is not available');
      }
      return await this.mundosService.findAll(true);
    } catch (error) {
      console.error('MundosController.findAllAdmin - Error:', error);
      throw error;
    }
  }

  // Endpoint específico para obtener por ID (debe ir antes de :slug)
  @Get('id/:id')
  @ApiOperation({ summary: 'Get a mundo by ID' })
  @ApiResponse({ status: 200, description: 'Mundo found' })
  @ApiResponse({ status: 404, description: 'Mundo not found' })
  async findOneById(@Param('id') id: string) {
    try {
      console.log('MundosController.findOneById - id:', id);
      console.log('MundosController.findOneById - service check:', !!this.mundosService);
      
      if (!this.mundosService) {
        throw new Error('MundosService is not available');
      }
      
      const mundo = await this.mundosService.findOne(id);
      console.log('MundosController.findOneById - mundo found:', mundo);
      return mundo;
    } catch (error) {
      console.error('MundosController.findOneById - Error:', error);
      throw error;
    }
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a mundo by slug' })
  @ApiResponse({ status: 200, description: 'Mundo found' })
  @ApiResponse({ status: 404, description: 'Mundo not found' })
  async findOneBySlug(@Param('slug') slug: string) {
    try {
      console.log('MundosController.findOneBySlug - slug:', slug);
      if (!this.mundosService) {
        throw new Error('MundosService is not available');
      }
      return await this.mundosService.findOneBySlug(slug);
    } catch (error) {
      console.error('MundosController.findOneBySlug - Error:', error);
      throw error;
    }
  }

  // Mantener compatibilidad con el endpoint anterior (tratará como ID si es numérico, sino como slug)
  @Get(':identifier')
  @ApiOperation({ summary: 'Get a mundo by ID or slug' })
  @ApiResponse({ status: 200, description: 'Mundo found' })
  @ApiResponse({ status: 404, description: 'Mundo not found' })
  async findOne(@Param('identifier') identifier: string) {
    try {
      console.log('MundosController.findOne - identifier:', identifier);
      console.log('MundosController.findOne - service check:', !!this.mundosService);
      
      if (!this.mundosService) {
        throw new Error('MundosService is not available');
      }
      
      // Si el identificador es un UUID o número, buscar por ID
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier) || /^\d+$/.test(identifier)) {
        console.log('MundosController.findOne - searching by ID');
        return await this.mundosService.findOne(identifier);
      } else {
        console.log('MundosController.findOne - searching by slug');
        return await this.mundosService.findOneBySlug(identifier);
      }
    } catch (error) {
      console.error('MundosController.findOne - Error:', error);
      throw error;
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new mundo' })
  @ApiResponse({ status: 201, description: 'Mundo created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async create(@Body() createMundoDto: CreateMundoDto) {
    try {
      console.log('MundosController.create - dto:', createMundoDto);
      if (!this.mundosService) {
        throw new Error('MundosService is not available');
      }
      return await this.mundosService.create(createMundoDto);
    } catch (error) {
      console.error('MundosController.create - Error:', error);
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a mundo by ID' })
  @ApiResponse({ status: 200, description: 'Mundo updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Mundo not found' })
  async update(@Param('id') id: string, @Body() updateMundoDto: UpdateMundoDto) {
    try {
      console.log('MundosController.update - id:', id, 'dto:', updateMundoDto);
      if (!this.mundosService) {
        throw new Error('MundosService is not available');
      }
      return await this.mundosService.update(id, updateMundoDto);
    } catch (error) {
      console.error('MundosController.update - Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Soft delete a mundo by ID' })
  @ApiResponse({ status: 200, description: 'Mundo soft deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Mundo not found' })
  async remove(@Param('id') id: string) {
    try {
      console.log('MundosController.remove - id:', id);
      if (!this.mundosService) {
        throw new Error('MundosService is not available');
      }
      return await this.mundosService.remove(id);
    } catch (error) {
      console.error('MundosController.remove - Error:', error);
      throw error;
    }
  }

  @Get(':id/playlists')
  @ApiOperation({ summary: 'Get playlists for a mundo' })
  async findPlaylists(@Param('id') id: string, @Req() req) {
    try {
      console.log('MundosController.findPlaylists - id:', id);
      console.log('MundosController.findPlaylists - service check:', !!this.mundosService);
      
      if (!this.mundosService) {
        console.warn('MundosController.findPlaylists - Service not available, using fallback');
        // Fallback a datos estáticos si hay error
        if (id === '1') {
          return [
            {
              id: '1',
              mundoId: '1',
              name: 'Introducción a JavaScript',
              description: 'Conceptos básicos de JavaScript',
              imageUrl: null,
              orderInMundo: 1,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: '2',
              mundoId: '1',
              name: 'React Avanzado',
              description: 'Conceptos avanzados de React',
              imageUrl: null,
              orderInMundo: 2,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ];
        } else if (id === '2') {
          return [
            {
              id: '3',
              mundoId: '2',
              name: 'Principios de Diseño',
              description: 'Fundamentos del diseño gráfico',
              imageUrl: null,
              orderInMundo: 1,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ];
        }
        return [];
      }
      
      // Usar el servicio real para obtener playlists
      const playlists = await this.mundosService.findPlaylistsByMundoId(id);
      console.log('MundosController.findPlaylists - playlists from DB:', playlists);
      return playlists;
    } catch (error) {
      console.error('MundosController.findPlaylists - Error:', error);
      // Fallback a datos estáticos si hay error
      if (id === '1') {
        return [
          {
            id: '1',
            mundoId: '1',
            name: 'Introducción a JavaScript',
            description: 'Conceptos básicos de JavaScript',
            imageUrl: null,
            orderInMundo: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            mundoId: '1',
            name: 'React Avanzado',
            description: 'Conceptos avanzados de React',
            imageUrl: null,
            orderInMundo: 2,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
      } else if (id === '2') {
        return [
          {
            id: '3',
            mundoId: '2',
            name: 'Principios de Diseño',
            description: 'Fundamentos del diseño gráfico',
            imageUrl: null,
            orderInMundo: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
      }
      return [];
    }
  }
} 