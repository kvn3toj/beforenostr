import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
// import { AuditLogsService } from '../../admin/audit-logs/audit-logs.service'; // Temporarily commented
// import { AuthenticatedUser } from '../../types/auth.types'; // Temporarily commented
import { Role, Permission, UserRole } from '../../generated/prisma';

@Injectable()
export class RolesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    // private readonly auditLogsService: AuditLogsService, // Temporarily commented
  ) {
// // //     console.log('>>> RolesService CONSTRUCTOR: Initializing...');
// //     console.log('>>> RolesService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
// //     console.log('>>> RolesService CONSTRUCTOR: this instance is', this);
// //     console.log('>>> RolesService CONSTRUCTOR: constructor name is', this.constructor.name);
  }

  async create(dto: CreateRoleDto, user: any): Promise<Role> {
//     console.log('>>> RolesService.create: Starting...');
//     console.log('>>> RolesService.create: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

    try {
      const newRole = await this.prisma.role.create({ data: dto });

      // await this.auditLogsService.createLog({
      //     userId: user.id,
      //     actionType: 'role:created',
      //     entityType: 'Role',
      //     entityId: newRole.id,
      //     newValue: newRole,
      // });

//       console.log('>>> RolesService.create: SUCCESS, created role with id:', newRole.id);
      return newRole;
    } catch (error) {
//       console.error('>>> RolesService.create: ERROR:', error);
      throw error;
    }
  }

  async findAll(): Promise<Role[]> {
//     console.log('>>> RolesService.findAll: Starting...');
//     console.log('>>> RolesService.findAll: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

    try {
      const result = await this.prisma.role.findMany({
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          },
          userRoles: {
            include: {
              user: true
            }
          }
        },
      });
//       console.log('>>> RolesService.findAll: SUCCESS, found', result.length, 'roles');
      return result;
    } catch (error) {
//       console.error('>>> RolesService.findAll: ERROR:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        userRoles: {
          include: {
            user: true
          }
        }
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  // Temporarily commented methods that use AuthenticatedUser and auditLogsService
  // TODO: Uncomment when AuthenticatedUser type and AuditLogsService are available

  /*
  async update(id: string, dto: UpdateRoleDto, user: AuthenticatedUser): Promise<Role> {
    const existingRole = await this.prisma.role.findUnique({ where: { id } });
    if (!existingRole) throw new NotFoundException('Role not found');

    const oldValue = existingRole;

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: dto,
    });

    const newValue = updatedRole;

    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'role:updated',
        entityType: 'Role',
        entityId: updatedRole.id,
        oldValue: oldValue,
        newValue: newValue,
    });

    return updatedRole;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<Role> {
    const existingRole = await this.prisma.role.findUnique({ where: { id } });
    if (!existingRole) throw new NotFoundException('Role not found');

    const oldValue = existingRole;

    const deletedRole = await this.prisma.role.delete({ where: { id } });

    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'role:deleted',
        entityType: 'Role',
        entityId: deletedRole.id,
        oldValue: oldValue,
    });

    return deletedRole;
  }

  // --- RolePermission management ---

  async assignPermissionsToRole(roleId: string, permissionIds: string[], user: AuthenticatedUser): Promise<Role> {
    const updatedRoleWithPermissions = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          set: permissionIds.map((id) => ({ id })),
        },
      },
      include: { permissions: true },
    });

    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'role:assigned_permissions',
        entityType: 'Role',
        entityId: roleId,
        newValue: updatedRoleWithPermissions.permissions,
    });

    return updatedRoleWithPermissions;
  }

  async removePermissionsFromRole(roleId: string, permissionIds: string[], user: AuthenticatedUser): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });
    if (!role) throw new NotFoundException('Role not found');

    const oldPermissions = role.permissions;

    const remaining = role.permissions
      .filter((p) => !permissionIds.includes(p.id))
      .map((p) => ({ id: p.id }));

    const updatedRoleWithPermissions = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: { set: remaining },
      },
      include: { permissions: true },
    });

    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'role:removed_permissions',
        entityType: 'Role',
        entityId: roleId,
        oldValue: oldPermissions,
        newValue: updatedRoleWithPermissions.permissions,
    });

    return updatedRoleWithPermissions;
  }

  // --- UserRole management ---

  async assignRoleToUser(userId: string, roleId: string, user: AuthenticatedUser): Promise<UserRole> {
    const newUserRole = await this.prisma.userRole.create({
      data: { userId, roleId },
      include: { user: true, role: true },
    });

    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'user:assigned_role',
        entityType: 'UserRole',
        entityId: newUserRole.id,
        newValue: { userId: newUserRole.userId, roleId: newUserRole.roleId },
    });

    return newUserRole;
  }

  async removeRoleFromUser(userId: string, roleId: string, user: AuthenticatedUser): Promise<void> {
    await this.prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });

    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'user:removed_role',
        entityType: 'UserRole',
        entityId: `${userId}-${roleId}`,
        oldValue: { userId, roleId },
    });
  }
  */
}
