import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Inject, Req,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Controller('roles')
export class RolesController {
  constructor(@Inject(RolesService) private readonly rolesService: RolesService) {
// // //     console.log('>>> RolesController CONSTRUCTOR: Initializing...');
// //     console.log('>>> RolesController CONSTRUCTOR: this.rolesService IS', this.rolesService ? 'DEFINED' : 'UNDEFINED');
// //     console.log('>>> RolesController CONSTRUCTOR: service type:', typeof this.rolesService);
// //     console.log('>>> RolesController CONSTRUCTOR: service constructor:', this.rolesService?.constructor?.name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  create(@Body() dto: CreateRoleDto, @Req() req) {
    return this.rolesService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  findAll() {
//     console.log('>>> RolesController.findAll: Starting...');
//     console.log('>>> RolesController.findAll: this.rolesService IS', this.rolesService ? 'DEFINED' : 'UNDEFINED');
    
    try {
//       console.log('>>> RolesController.findAll: Calling service.findAll()...');
      const result = this.rolesService.findAll();
//       console.log('>>> RolesController.findAll: SUCCESS, returning result');
      return result;
    } catch (error) {
//       console.error('>>> RolesController.findAll: ERROR:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role' })
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  // --- RolePermission assignment endpoints ---

  @Post(':roleId/assign-permissions')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(
    @Param('roleId') roleId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissionsToRole(roleId, dto.permissionIds);
  }

  @Post(':roleId/remove-permissions')
  @ApiOperation({ summary: 'Remove permissions from a role' })
  removePermissions(
    @Param('roleId') roleId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.removePermissionsFromRole(roleId, dto.permissionIds);
  }

  // --- UserRole assignment endpoints ---

  @Post('/users/:userId/assign-role')
  @ApiOperation({ summary: 'Assign a role to a user' })
  assignRoleToUser(
    @Param('userId') userId: string,
    @Body() dto: AssignRoleDto,
  ) {
    return this.rolesService.assignRoleToUser(userId, dto.roleId);
  }

  @Delete('/users/:userId/roles/:roleId')
  @ApiOperation({ summary: 'Remove a role from a user' })
  removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.rolesService.removeRoleFromUser(userId, roleId);
  }
} 