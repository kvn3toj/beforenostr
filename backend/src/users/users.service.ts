import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AuditLogsService } from '../admin/audit-logs/audit-logs.service'; // Temporarily commented
// import { AuthenticatedUser } from '../types/auth.types'; // Temporarily commented
// import { UserAuditSnapshot } from '../types/user.types'; // Temporarily commented
import { User } from '../generated/prisma';
import * as bcrypt from 'bcryptjs';

// Tipo explícito para snapshots de usuario en logs de auditoría
// export interface UserAuditSnapshot {
//   id: string;
//   email: string;
//   name?: string | null;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

type AuthenticatedUser = { id: string /* other properties may be included */ };

@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService
    // private readonly auditLogsService: AuditLogsService, // Temporarily commented
  ) {
    // // //     console.log('>>> UsersService CONSTRUCTOR: Initializing...');
    // //     console.log('>>> UsersService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    // //     console.log('>>> UsersService CONSTRUCTOR: this instance is', this);
    // //     console.log('>>> UsersService CONSTRUCTOR: constructor name is', this.constructor.name);
  }

  async findAll() {
    //     console.log('>>> UsersService.findAll: Starting...');
    //     console.log('>>> UsersService.findAll: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

    const result = await this.prisma.user.findMany();
    //       console.log('>>> UsersService.findAll: SUCCESS, found', result.length, 'users');
    return result;
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
    const where: {
      email?: { contains: string; mode: 'insensitive' };
      isActive?: boolean;
    } = {};

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
    const orderBy: { [key: string]: 'asc' | 'desc' } = {};
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
    //     console.log('>>> UsersService.findOne: Starting with id:', id);
    //     console.log('>>> UsersService.findOne: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

    const user = await this.prisma.user.findUnique({ where: { id } });
    //       console.log('>>> UsersService.findOne: Query result:', user ? 'FOUND' : 'NOT FOUND');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async create(data: CreateUserDto, user: AuthenticatedUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createData = {
      ...data,
      password: hashedPassword,
    };

    const newUser = await this.prisma.user.create({ data: createData });

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

  async update(
    id: string,
    data: UpdateUserDto,
    user: AuthenticatedUser
  ): Promise<User> {
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

  async remove(id: string, user: AuthenticatedUser): Promise<User> {
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

  async getAyniMetrics(userId: string) {
    //     console.log('>>> UsersService.getAyniMetrics: Starting for user:', userId);

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 🌟 GENERAR MÉTRICAS AYNI DINÁMICAS BASADAS EN DATOS REALES
    // Por ahora, generamos métricas realistas basadas en el usuario
    // En el futuro, estas se calcularán desde transacciones, actividades, etc.

    const baseMetrics = {
      ondas: 1000 + user.id.length * 47, // Base de 1000 + variación por usuario
      meritos: 50 + user.id.length * 7, // Base de 50 + variación
      balanceAyni: Math.min(1, 0.6 + user.id.length * 0.02), // Entre 0.6 y 1.0
      ayniLevel: this.calculateAyniLevel(user),
      nextLevel: this.getNextAyniLevel(user),
      ayniProgress: this.calculateAyniProgress(user),
      bienComunContributions: 10 + user.id.length * 3,
      reciprocityScore: Math.min(10, 7 + user.id.length * 0.15),
      elementos: this.calculateElementalBalance(user),
      totalTransactions: 25 + user.id.length * 5,
      positiveImpact: 500 + user.id.length * 73,
      communityRank: Math.max(1, 200 - user.id.length * 8),
      weeklyGrowth:
        Math.round((Math.sin(user.id.length) * 10 + 15) * 100) / 100,
      lastUpdated: new Date().toISOString(),
      joinedDate: user.createdAt.toISOString(),
    };

    //       console.log('>>> UsersService.getAyniMetrics: Generated metrics for user:', user.email);
    return baseMetrics;
  }

  private calculateAyniLevel(user: User): string {
    // Calcular nivel basado en características del usuario
    const userScore = user.id.length + user.email.length * 2;

    if (userScore > 60) return 'Guardián del Bien Común';
    if (userScore > 50) return 'Emprendedor Confiable';
    if (userScore > 40) return 'Colaborador Activo';
    if (userScore > 30) return 'Aprendiz del Ayni';
    return 'Iniciado en CoomÜnity';
  }

  private getNextAyniLevel(user: User): string {
    const currentLevel = this.calculateAyniLevel(user);

    const levelProgression = {
      'Iniciado en CoomÜnity': 'Aprendiz del Ayni',
      'Aprendiz del Ayni': 'Colaborador Activo',
      'Colaborador Activo': 'Emprendedor Confiable',
      'Emprendedor Confiable': 'Guardián del Bien Común',
      'Guardián del Bien Común': 'Maestro Cósmico',
    };

    return levelProgression[currentLevel] || 'Maestro Cósmico';
  }

  private calculateAyniProgress(user: User): number {
    // Progreso basado en el tiempo desde creación y características del usuario
    const daysSinceJoined = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const baseProgress = Math.min(90, daysSinceJoined * 2 + user.id.length * 3);

    return Math.max(10, baseProgress); // Mínimo 10%, máximo calculado
  }

  private calculateElementalBalance(user: User) {
    // Generar balance elemental único para cada usuario
    const seed = user.id.length + user.email.length;

    return {
      fuego: 200 + seed * 7 + Math.floor(Math.sin(seed) * 50), // Acciones/Energía
      agua: 150 + seed * 5 + Math.floor(Math.cos(seed) * 40), // Adaptabilidad/Emociones
      tierra: 180 + seed * 6 + Math.floor(Math.sin(seed * 2) * 45), // Estabilidad/Crecimiento
      aire: 120 + seed * 4 + Math.floor(Math.cos(seed * 1.5) * 35), // Visión/Claridad mental
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
