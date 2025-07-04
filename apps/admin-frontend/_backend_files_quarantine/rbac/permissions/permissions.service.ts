import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { AuditLogsService } from '../../admin/audit-logs/audit-logs.service';
import { AuthenticatedUser } from '../../types/auth.types';
import { Permission } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditLogsService) private readonly auditLogsService: AuditLogsService,
  ) {
    console.log('>>> PermissionsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> PermissionsService CONSTRUCTOR: this.auditLogsService IS', this.auditLogsService ? 'DEFINED' : 'UNDEFINED');
  }

  async create(dto: CreatePermissionDto, user?: AuthenticatedUser): Promise<Permission> {
    console.log('>>> PermissionsService.create CALLED with dto:', dto);
    console.log('>>> PermissionsService.create user:', user);
    
    try {
      console.log('>>> PermissionsService.create: About to call prisma.permission.create');
      const newPermission = await this.prisma.permission.create({ data: dto });
      console.log('>>> PermissionsService.create: Permission created successfully:', newPermission);

      if (user) {
        console.log('>>> PermissionsService.create: About to create audit log');
        await this.auditLogsService.createLog({
            userId: user.id,
            actionType: 'permission:created',
            entityType: 'Permission',
            entityId: newPermission.id,
            newValue: newPermission,
        });
        console.log('>>> PermissionsService.create: Audit log created successfully');
      }

      return newPermission;
    } catch (error) {
      console.error('>>> PermissionsService.create ERROR:', error);
      throw error;
    }
  }

  async findAll(): Promise<Permission[]> {
    console.log('>>> PermissionsService.findAll CALLED');
    
    try {
      console.log('>>> PermissionsService.findAll: About to call prisma.permission.findMany');
      const permissions = await this.prisma.permission.findMany();
      console.log('>>> PermissionsService.findAll: Found permissions:', permissions.length);
      return permissions;
    } catch (error) {
      console.error('>>> PermissionsService.findAll ERROR:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Permission | null> {
    console.log('>>> PermissionsService.findOne CALLED with id:', id);
    
    try {
      console.log('>>> PermissionsService.findOne: About to call prisma.permission.findUnique');
      const permission = await this.prisma.permission.findUnique({ where: { id } });
      console.log('>>> PermissionsService.findOne: Found permission:', permission);
      
      if (!permission) {
        console.log('>>> PermissionsService.findOne: Permission not found, throwing NotFoundException');
        throw new NotFoundException('Permission not found');
      }
      
      return permission;
    } catch (error) {
      console.error('>>> PermissionsService.findOne ERROR:', error);
      throw error;
    }
  }

  async update(id: string, dto: UpdatePermissionDto, user?: AuthenticatedUser): Promise<Permission> {
    console.log('>>> PermissionsService.update CALLED with id:', id, 'dto:', dto);
    console.log('>>> PermissionsService.update user:', user);
    
    try {
      console.log('>>> PermissionsService.update: About to find existing permission');
      const existingPermission = await this.prisma.permission.findUnique({ where: { id } });
      
      if (!existingPermission) {
        console.log('>>> PermissionsService.update: Permission not found, throwing NotFoundException');
        throw new NotFoundException('Permission not found');
      }

      const oldValue = existingPermission;
      console.log('>>> PermissionsService.update: About to update permission');

      const updatedPermission = await this.prisma.permission.update({
        where: { id },
        data: dto,
      });
      console.log('>>> PermissionsService.update: Permission updated successfully:', updatedPermission);

      const newValue = updatedPermission;

      if (user) {
        console.log('>>> PermissionsService.update: About to create audit log');
        await this.auditLogsService.createLog({
            userId: user.id,
            actionType: 'permission:updated',
            entityType: 'Permission',
            entityId: updatedPermission.id,
            oldValue,
            newValue,
        });
        console.log('>>> PermissionsService.update: Audit log created successfully');
      }

      return updatedPermission;
    } catch (error) {
      console.error('>>> PermissionsService.update ERROR:', error);
      throw error;
    }
  }

  async remove(id: string, user?: AuthenticatedUser): Promise<Permission> {
    console.log('>>> PermissionsService.remove CALLED with id:', id);
    console.log('>>> PermissionsService.remove user:', user);
    
    try {
      console.log('>>> PermissionsService.remove: About to find existing permission');
      const existingPermission = await this.prisma.permission.findUnique({ where: { id } });
      
      if (!existingPermission) {
        console.log('>>> PermissionsService.remove: Permission not found, throwing NotFoundException');
        throw new NotFoundException('Permission not found');
      }

      const oldValue = existingPermission;
      console.log('>>> PermissionsService.remove: About to delete permission');

      const deletedPermission = await this.prisma.permission.delete({ where: { id } });
      console.log('>>> PermissionsService.remove: Permission deleted successfully:', deletedPermission);

      if (user) {
        console.log('>>> PermissionsService.remove: About to create audit log');
        await this.auditLogsService.createLog({
            userId: user.id,
            actionType: 'permission:deleted',
            entityType: 'Permission',
            entityId: deletedPermission.id,
            oldValue,
        });
        console.log('>>> PermissionsService.remove: Audit log created successfully');
      }

      return deletedPermission;
    } catch (error) {
      console.error('>>> PermissionsService.remove ERROR:', error);
      throw error;
    }
  }
} 