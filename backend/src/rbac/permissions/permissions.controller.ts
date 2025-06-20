import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Inject,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('permissions')
export class PermissionsController {
  constructor(@Inject(PermissionsService) private readonly permissionsService: PermissionsService) {
// //     console.log('>>> PermissionsController CONSTRUCTOR: this.permissionsService IS', this.permissionsService ? 'DEFINED' : 'UNDEFINED');
  }

  // Endpoint de prueba temporal sin guards
  @Get('test')
  @ApiOperation({ summary: 'Test permissions endpoint without auth' })
  async test() {
//     console.log('>>> PermissionsController.test CALLED');
    
    try {
//       console.log('>>> PermissionsController.test: About to call permissionsService.findAll');
      const result = await this.permissionsService.findAll();
//       console.log('>>> PermissionsController.test: Service call successful, result count:', result.length);
      return { status: 'success', count: result.length, data: result };
    } catch (error) {
//       console.error('>>> PermissionsController.test ERROR:', error);
      return { status: 'error', error: error.message, stack: error.stack };
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created' })
  async create(@Body() dto: CreatePermissionDto) {
//     console.log('>>> PermissionsController.create CALLED with dto:', dto);
    
    try {
//       console.log('>>> PermissionsController.create: About to call permissionsService.create');
      const result = await this.permissionsService.create(dto);
//       console.log('>>> PermissionsController.create: Service call successful, result:', result);
      return result;
    } catch (error) {
//       console.error('>>> PermissionsController.create ERROR:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll() {
//     console.log('>>> PermissionsController.findAll CALLED');
    
    try {
//       console.log('>>> PermissionsController.findAll: About to call permissionsService.findAll');
      const result = await this.permissionsService.findAll();
//       console.log('>>> PermissionsController.findAll: Service call successful, result count:', result.length);
      return result;
    } catch (error) {
//       console.error('>>> PermissionsController.findAll ERROR:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  async findOne(@Param('id') id: string) {
//     console.log('>>> PermissionsController.findOne CALLED with id:', id);
    
    try {
//       console.log('>>> PermissionsController.findOne: About to call permissionsService.findOne');
      const result = await this.permissionsService.findOne(id);
//       console.log('>>> PermissionsController.findOne: Service call successful, result:', result);
      return result;
    } catch (error) {
//       console.error('>>> PermissionsController.findOne ERROR:', error);
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a permission' })
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
//     console.log('>>> PermissionsController.update CALLED with id:', id, 'dto:', dto);
    
    try {
//       console.log('>>> PermissionsController.update: About to call permissionsService.update');
      const result = await this.permissionsService.update(id, dto);
//       console.log('>>> PermissionsController.update: Service call successful, result:', result);
      return result;
    } catch (error) {
//       console.error('>>> PermissionsController.update ERROR:', error);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission' })
  async remove(@Param('id') id: string) {
//     console.log('>>> PermissionsController.remove CALLED with id:', id);
    
    try {
//       console.log('>>> PermissionsController.remove: About to call permissionsService.remove');
      const result = await this.permissionsService.remove(id);
//       console.log('>>> PermissionsController.remove: Service call successful, result:', result);
      return result;
    } catch (error) {
//       console.error('>>> PermissionsController.remove ERROR:', error);
      throw error;
    }
  }
} 