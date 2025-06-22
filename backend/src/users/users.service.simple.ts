import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SimpleUsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // // //     console.log('>>> SimpleUsersService CONSTRUCTOR: Initializing...');
    // //     console.log('>>> SimpleUsersService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    // //     console.log('>>> SimpleUsersService CONSTRUCTOR: prisma type:', typeof this.prisma);
    // //     console.log('>>> SimpleUsersService CONSTRUCTOR: prisma constructor:', this.prisma?.constructor?.name);

    if (!this.prisma) {
      throw new Error(
        'SimpleUsersService: PrismaService dependency injection failed'
      );
    }
  }

  async findAll() {
    //     console.log('>>> SimpleUsersService.findAll called');
    //     console.log('>>> SimpleUsersService.findAll - this.prisma:', !!this.prisma);
    //     console.log('>>> SimpleUsersService.findAll - this.prisma.user:', !!this.prisma?.user);

    if (!this.prisma) {
      throw new Error('Prisma client is not available');
    }

    if (!this.prisma.user) {
      throw new Error('User model is not available in Prisma client');
    }

    return this.prisma.user.findMany();
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
    //     console.log('>>> SimpleUsersService.findAllPaginated called with params:', params);

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
}
