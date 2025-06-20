import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AuditLogsService } from '../admin/audit-logs/audit-logs.service'; // Temporarily commented
// import { AuthenticatedUser } from '../types/auth.types'; // Temporarily commented
// import { UserAuditSnapshot } from '../types/user.types'; // Temporarily commented
import { User } from '@prisma/client';

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
    
    // TODO: Implementar filtro por role_id cuando tengamos la relación con roles
    
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
          // TODO: Incluir relación con roles cuando esté disponible
          // role: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    
    return {
      data: users,
      count: users.length,
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

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
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

    return updatedUser;
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