import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AuditLogsService } from '../admin/audit-logs/audit-logs.service'; // Temporarily commented
// import { AuthenticatedUser } from '../types/auth.types'; // Temporarily commented
// import { UserAuditSnapshot } from '../types/user.types'; // Temporarily commented
import type { User } from '../generated/prisma';

// Tipo explícito para snapshots de usuario en logs de auditoría
// export interface UserAuditSnapshot {
//   id: string;
//   email: string;
//   name?: string | null;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    // private readonly auditLogsService: AuditLogsService, // Temporarily commented
  ) {
    console.log('>>> UsersService CONSTRUCTOR: Initializing...');
    console.log('>>> UsersService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> UsersService CONSTRUCTOR: this instance is', this);
    console.log('>>> UsersService CONSTRUCTOR: constructor name is', this.constructor.name);
  }

  async findAll() {
    console.log('>>> UsersService.findAll: Starting...');
    console.log('>>> UsersService.findAll: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const result = await this.prisma.user.findMany();
      console.log('>>> UsersService.findAll: SUCCESS, found', result.length, 'users');
      return result;
    } catch (error) {
      console.error('>>> UsersService.findAll: ERROR:', error);
      throw error;
    }
  }

  async findAllPaginated(params: {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    filters?: {
      email?: string;
      role_id?: string;
      is_active?: boolean;
    };
  }) {
    const { page, pageSize, sortBy, sortDirection, filters } = params;
    
    // Construir el objeto where para filtros
    const where: any = {};
    
    if (filters?.email) {
      where.email = {
        contains: filters.email,
        mode: 'insensitive',
      };
    }
    
    if (filters?.is_active !== undefined) {
      where.isActive = filters.is_active;
    }
    
    // Filtro por role_id
    if (filters?.role_id) {
      where.userRoles = {
        some: {
          roleId: filters.role_id,
        },
      };
    }
    
    // Construir el objeto orderBy para ordenamiento
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortDirection || 'asc';
    } else {
      orderBy.createdAt = 'desc'; // Ordenamiento por defecto
    }
    
    // Ejecutar consultas en paralelo
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip: page * pageSize,
        take: pageSize,
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    
    // Formatear los usuarios para incluir la información de roles de manera más accesible
    const formattedUsers = users.map(user => ({
      ...user,
      roles: user.userRoles.map(ur => ur.role),
      primaryRole: user.userRoles.length > 0 ? user.userRoles[0].role : null,
    }));
    
    return {
      data: formattedUsers,
      count: formattedUsers.length,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    console.log('>>> UsersService.findOne: Starting with id:', id);
    console.log('>>> UsersService.findOne: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      console.log('>>> UsersService.findOne: Query result:', user ? 'FOUND' : 'NOT FOUND');
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
    } catch (error) {
      console.error('>>> UsersService.findOne: ERROR:', error);
      throw error;
    }
  }

  async findCurrentUser(id: string) {
    console.log('>>> UsersService.findCurrentUser: Starting with id:', id);
    console.log('>>> UsersService.findCurrentUser: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      console.log('>>> UsersService.findCurrentUser: Query result:', user ? 'FOUND' : 'NOT FOUND');
      if (!user) throw new NotFoundException('Usuario no encontrado');
      
      // Formatear la respuesta para que coincida con lo que espera el frontend
      const formattedUser = {
        id: user.id,
        email: user.email,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario',
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.userRoles.map(ur => ur.role.name),
        permissions: user.userRoles.flatMap(ur => 
          ur.role.rolePermissions.map(rp => rp.permission.name)
        )
      };
      
      console.log('>>> UsersService.findCurrentUser: SUCCESS, returning formatted user');
      return formattedUser;
    } catch (error) {
      console.error('>>> UsersService.findCurrentUser: ERROR:', error);
      throw error;
    }
  }

  async create(data: CreateUserDto, user: any): Promise<User> {
    const newUser = await this.prisma.user.create({ data });

    // const newValue: UserAuditSnapshot = {
    //   id: newUser.id,
    //   email: newUser.email,
    //   name: newUser.name ?? null,
    //   isActive: newUser.isActive,
    //   createdAt: newUser.createdAt,
    //   updatedAt: newUser.updatedAt,
    // };

    // await this.auditLogsService.createLog({
    //     userId: user.id,
    //     actionType: 'user:created',
    //     entityType: 'User',
    //     entityId: newUser.id,
    //     newValue: newValue,
    // });

    return newUser;
  }

  async update(id: string, data: UpdateUserDto, user: any): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) throw new NotFoundException('Usuario no encontrado');

    // const oldValue: UserAuditSnapshot = {
    //   id: existingUser.id,
    //   email: existingUser.email,
    //   name: existingUser.name ?? null,
    //   isActive: existingUser.isActive,
    //   createdAt: existingUser.createdAt,
    //   updatedAt: existingUser.updatedAt,
    // };

    // Extraer el roleId de los datos para manejo especial
    const { roleId, ...userData } = data;

    // Actualizar los datos del usuario (excluyendo roleId)
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    // Si se proporciona un roleId, manejar la asignación de rol
    if (roleId !== undefined) {
      if (roleId === null || roleId === '') {
        // Remover todos los roles del usuario
        await this.prisma.userRole.deleteMany({
          where: { userId: id },
        });
      } else {
        // Verificar que el rol existe
        const roleExists = await this.prisma.role.findUnique({
          where: { id: roleId },
        });
        
        if (!roleExists) {
          throw new NotFoundException('Rol no encontrado');
        }

        // Remover roles existentes y asignar el nuevo rol
        await this.prisma.$transaction(async (tx) => {
          // Eliminar roles existentes
          await tx.userRole.deleteMany({
            where: { userId: id },
          });
          
          // Asignar el nuevo rol
          await tx.userRole.create({
            data: {
              userId: id,
              roleId: roleId,
              assignedById: user.id, // El usuario que hace la asignación
            },
          });
        });
      }
    }

    // Obtener el usuario actualizado con los roles incluidos
    const finalUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // const newValue: UserAuditSnapshot = {
    //   id: updatedUser.id,
    //   email: updatedUser.email,
    //   name: updatedUser.name ?? null,
    //   isActive: updatedUser.isActive,
    //   createdAt: updatedUser.createdAt,
    //   updatedAt: updatedUser.updatedAt,
    // };

    // await this.auditLogsService.createLog({
    //     userId: user.id,
    //     actionType: 'user:updated',
    //     entityType: 'User',
    //     entityId: updatedUser.id,
    //     oldValue: oldValue,
    //     newValue: newValue,
    // });

    return finalUser as User;
  }

  async remove(id: string, user: any): Promise<User> {
     const existingUser = await this.prisma.user.findUnique({ where: { id } });
     if (!existingUser) throw new NotFoundException('Usuario no encontrado');

     // const oldValue: UserAuditSnapshot = {
     //  id: existingUser.id,
     //  email: existingUser.email,
     //  name: existingUser.name ?? null,
     //  isActive: existingUser.isActive,
     //  createdAt: existingUser.createdAt,
     //  updatedAt: existingUser.updatedAt,
     // };

    const softDeletedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    // const newValue: UserAuditSnapshot = {
    //   id: softDeletedUser.id,
    //   email: softDeletedUser.email,
    //   name: softDeletedUser.name ?? null,
    //   isActive: softDeletedUser.isActive,
    //   createdAt: softDeletedUser.createdAt,
    //   updatedAt: softDeletedUser.updatedAt,
    // };

    // await this.auditLogsService.createLog({
    //     userId: user.id,
    //     actionType: 'user:soft_deleted',
    //     entityType: 'User',
    //     entityId: softDeletedUser.id,
    //     oldValue: oldValue,
    //     newValue: newValue,
    // });

    return softDeletedUser;
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
} 