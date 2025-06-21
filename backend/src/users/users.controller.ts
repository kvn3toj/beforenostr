import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, Query, Inject
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {
// // //     console.log('>>> UsersController CONSTRUCTOR: Initializing...');
// //     console.log('>>> UsersController CONSTRUCTOR: this.usersService IS', this.usersService ? 'DEFINED' : 'UNDEFINED');
    console.log('UsersController constructor - service:', this.usersService ? 'available' : 'undefined');
    console.log('UsersController constructor - service type:', typeof this.usersService);
    console.log('UsersController constructor - service constructor:', this.usersService?.constructor?.name);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener usuarios con paginación y filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (0-indexed)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Tamaño de página' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Campo para ordenar' })
  @ApiQuery({ name: 'sortDirection', required: false, enum: ['asc', 'desc'], description: 'Dirección del ordenamiento' })
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Filtro por email' })
  @ApiQuery({ name: 'role_id', required: false, type: String, description: 'Filtro por rol' })
  @ApiQuery({ name: 'is_active', required: false, type: Boolean, description: 'Filtro por estado activo' })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('email') email?: string,
    @Query('role_id') roleId?: string,
    @Query('is_active') isActive?: string,
  ) {
//     console.log('>>> UsersController.findAll: Starting...');
//     console.log('>>> UsersController.findAll: this.usersService IS', this.usersService ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const params = {
        page: page ? parseInt(page, 10) : 0,
        pageSize: pageSize ? parseInt(pageSize, 10) : 10,
        sortBy,
        sortDirection,
        filters: {
          email,
          role_id: roleId,
          is_active: isActive !== undefined ? isActive === 'true' : undefined,
        },
      };

//       console.log('>>> UsersController.findAll: Calling service with params:', params);
      const result = await this.usersService.findAllPaginated(params);
//       console.log('>>> UsersController.findAll: SUCCESS, returning result');
      return result;
    } catch (error) {
//       console.error('>>> UsersController.findAll: ERROR:', error);
      throw error;
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint para verificar que el controlador funciona' })
  async test() {
    return { message: 'Users controller is working!', timestamp: new Date().toISOString() };
  }

  @Get('test-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Test endpoint solo con AuthGuard, sin RolesGuard' })
  async testAuth(@Req() req) {
    return { 
      message: 'Auth test working!', 
      user: req.user,
      timestamp: new Date().toISOString() 
    };
  }

  @Get('simple')
  @Roles('admin')
  @ApiOperation({ summary: 'Simple endpoint para obtener usuarios sin paginación' })
  async findAllSimple() {
//     console.log('>>> UsersController.findAllSimple: Starting...');
//     console.log('>>> UsersController.findAllSimple: this.usersService IS', this.usersService ? 'DEFINED' : 'UNDEFINED');
    
    try {
//       console.log('>>> UsersController.findAllSimple: Calling service.findAll()...');
      const result = await this.usersService.findAll();
//       console.log('>>> UsersController.findAllSimple: SUCCESS, returning result');
      return result;
    } catch (error) {
//       console.error('>>> UsersController.findAllSimple: ERROR:', error);
      throw error;
    }
  }

  @Get('db-test')
  @ApiOperation({ summary: 'Test directo de la base de datos' })
  async dbTest() {
    try {
      // Test directo sin usar el servicio
      console.log('UsersController.dbTest - service check:', !!this.usersService);
      if (!this.usersService) {
        console.log('UsersController.dbTest - Service is undefined!');
        return { 
          message: 'DB test endpoint working!', 
          timestamp: new Date().toISOString(),
          service: 'Service not available',
          error: 'UsersService is not injected'
        };
      }
      return { 
        message: 'DB test endpoint working!', 
        timestamp: new Date().toISOString(),
        service: 'Service available'
      };
    } catch (error) {
      console.error('Error in UsersController.dbTest:', error);
      return { error: error.message };
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  async getMe(@Req() req) {
    // Return the authenticated user from the JWT strategy
    return req.user;
  }

  @Get(':id/ayni-metrics')
  @ApiOperation({ summary: 'Obtener métricas Ayni del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Métricas Ayni del usuario obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        ondas: { type: 'number', description: 'Öndas acumuladas del usuario' },
        meritos: { type: 'number', description: 'Mëritos ganados' },
        balanceAyni: { type: 'number', description: 'Balance Ayni (0-1)' },
        ayniLevel: { type: 'string', description: 'Nivel actual de Ayni' },
        nextLevel: { type: 'string', description: 'Próximo nivel' },
        ayniProgress: { type: 'number', description: 'Progreso hacia el siguiente nivel (%)' },
        bienComunContributions: { type: 'number', description: 'Contribuciones al Bien Común' },
        reciprocityScore: { type: 'number', description: 'Puntuación de reciprocidad' },
        elementos: {
          type: 'object',
          properties: {
            fuego: { type: 'number', description: 'Puntos de elemento Fuego' },
            agua: { type: 'number', description: 'Puntos de elemento Agua' },
            tierra: { type: 'number', description: 'Puntos de elemento Tierra' },
            aire: { type: 'number', description: 'Puntos de elemento Aire' }
          }
        },
        totalTransactions: { type: 'number', description: 'Total de transacciones' },
        positiveImpact: { type: 'number', description: 'Impacto positivo generado' },
        communityRank: { type: 'number', description: 'Ranking en la comunidad' },
        weeklyGrowth: { type: 'number', description: 'Crecimiento semanal (%)' },
        lastUpdated: { type: 'string', description: 'Última actualización' },
        joinedDate: { type: 'string', description: 'Fecha de registro' }
      }
    }
  })
  async getAyniMetrics(@Param('id') id: string, @Req() req) {
    // Verificar que el usuario puede acceder a estas métricas
    const canAccess = req.user.id === id || req.user.roles.includes('admin');
    
    if (!canAccess) {
      return { 
        message: 'No tienes permisos para ver estas métricas',
        statusCode: 403 
      };
    }

    return this.usersService.getAyniMetrics(id);
  }

  @Get('debug-roles')
  @Roles('admin')
  @ApiOperation({ summary: 'Debug endpoint para probar RolesGuard' })
  async debugRoles(@Req() req) {
    return { 
      message: 'RolesGuard test working!', 
      user: req.user,
      timestamp: new Date().toISOString() 
    };
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo usuario (solo admin)' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  async create(@Body() createUserDto: CreateUserDto, @Req() req) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar (soft delete) un usuario' })
  async remove(@Param('id') id: string, @Req() req) {
    await this.usersService.remove(id, req.user);
    return;
  }
} 