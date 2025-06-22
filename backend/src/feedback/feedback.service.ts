import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo feedback reportado por el Oráculo de CoomÜnity
   * @param dto - Datos del feedback
   * @param userId - ID del usuario administrador que reporta el feedback
   * @returns El feedback creado
   */
  async create(dto: CreateFeedbackDto, userId: string) {
    try {
      this.logger.log(`📝 [ORÁCULO] Creando feedback para usuario ${userId}`);
      this.logger.log(`📍 [ORÁCULO] URL: ${dto.pageUrl}`);
      this.logger.log(`🔍 [ORÁCULO] Tipo: ${dto.feedbackType}`);

      // TODO: Descomentar cuando se ejecute la migración de PostgreSQL
      /*
      const feedback = await this.prisma.feedback.create({
        data: {
          userId,
          pageUrl: dto.pageUrl,
          feedbackText: dto.feedbackText,
          feedbackType: dto.feedbackType,
          componentContext: dto.componentContext,
          technicalContext: dto.technicalContext || {},
          priority: dto.priority || 0,
          tags: dto.tags || [],
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            },
          },
        },
      });
      */

      // Mock temporal para desarrollo sin PostgreSQL
      const mockFeedback = {
        id: `mock_${Date.now()}`,
        userId,
        pageUrl: dto.pageUrl,
        feedbackText: dto.feedbackText,
        feedbackType: dto.feedbackType,
        componentContext: dto.componentContext,
        technicalContext: dto.technicalContext || {},
        priority: dto.priority || 0,
        tags: dto.tags || [],
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          email: 'admin@coomunity.com',
          name: 'Administrador Oráculo',
          username: 'oraculo_admin',
        },
      };

      this.logger.log(
        `✅ [ORÁCULO] Feedback creado exitosamente (MOCK): ${mockFeedback.id}`
      );

      // Aquí se podría agregar lógica para:
      // - Notificar a la CoP Oráculo sobre el nuevo feedback
      // - Asignar automáticamente basado en prioridad/tags
      // - Crear métricas para gamificación

      return mockFeedback;
    } catch (error) {
      this.logger.error(
        `❌ [ORÁCULO] Error creando feedback: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Obtiene todos los feedbacks con filtros opcionales
   * @param filters - Filtros opcionales para la consulta
   * @returns Lista de feedbacks
   */
  async findAll(filters?: {
    status?: string;
    feedbackType?: string;
    userId?: string;
    priority?: number;
    limit?: number;
    offset?: number;
  }) {
    try {
      this.logger.log(
        `🔍 [ORÁCULO] Obteniendo feedbacks con filtros:`,
        filters
      );

      // TODO: Descomentar cuando se ejecute la migración de PostgreSQL
      /*
      const where: any = {};

      if (filters?.status) where.status = filters.status;
      if (filters?.feedbackType) where.feedbackType = filters.feedbackType;
      if (filters?.userId) where.userId = filters.userId;
      if (filters?.priority !== undefined) where.priority = filters.priority;

      const feedbacks = await this.prisma.feedback.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      });
      */

      // Mock temporal para desarrollo
      const mockFeedbacks = [
        {
          id: 'mock_1',
          pageUrl: 'http://localhost:3001/uplay',
          feedbackText: 'El reproductor de video no responde correctamente',
          feedbackType: 'BUG',
          status: 'PENDING',
          priority: 3,
          createdAt: new Date(),
          user: {
            id: '1',
            email: 'admin@coomunity.com',
            name: 'Admin',
            username: 'admin',
          },
        },
      ];

      this.logger.log(
        `📊 [ORÁCULO] Encontrados ${mockFeedbacks.length} feedbacks (MOCK)`
      );
      return mockFeedbacks;
    } catch (error) {
      this.logger.error(
        `❌ [ORÁCULO] Error obteniendo feedbacks: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Obtiene un feedback específico por ID
   * @param id - ID del feedback
   * @returns El feedback encontrado
   */
  async findOne(id: string) {
    try {
      this.logger.log(`🔍 [ORÁCULO] Obteniendo feedback: ${id}`);

      // TODO: Descomentar cuando se ejecute la migración de PostgreSQL
      /*
      const feedback = await this.prisma.feedback.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            },
          },
        },
      });
      */

      // Mock temporal para desarrollo
      const mockFeedback = {
        id,
        pageUrl: 'http://localhost:3001/uplay',
        feedbackText: 'Feedback de ejemplo',
        feedbackType: 'BUG',
        status: 'PENDING',
        priority: 2,
        createdAt: new Date(),
        user: {
          id: '1',
          email: 'admin@coomunity.com',
          name: 'Admin',
          username: 'admin',
        },
      };

      this.logger.log(
        `✅ [ORÁCULO] Feedback encontrado (MOCK): ${mockFeedback.id}`
      );
      return mockFeedback;
    } catch (error) {
      this.logger.error(
        `❌ [ORÁCULO] Error obteniendo feedback: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Actualiza el estado de un feedback
   * @param id - ID del feedback
   * @param status - Nuevo estado
   * @returns El feedback actualizado
   */
  async updateStatus(id: string, status: string) {
    try {
      this.logger.log(
        `🔄 [ORÁCULO] Actualizando status de feedback ${id} a: ${status}`
      );

      // TODO: Descomentar cuando se ejecute la migración de PostgreSQL
      /*
      const feedback = await this.prisma.feedback.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            },
          },
        },
      });
      */

      // Mock temporal para desarrollo
      const mockFeedback = {
        id,
        status,
        updatedAt: new Date(),
        user: {
          id: '1',
          email: 'admin@coomunity.com',
          name: 'Admin',
          username: 'admin',
        },
      };

      this.logger.log(
        `✅ [ORÁCULO] Status actualizado exitosamente (MOCK): ${mockFeedback.id}`
      );
      return mockFeedback;
    } catch (error) {
      this.logger.error(
        `❌ [ORÁCULO] Error actualizando status: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de feedbacks para la CoP Oráculo
   * @returns Estadísticas agregadas
   */
  async getStats() {
    try {
      this.logger.log(`📊 [ORÁCULO] Generando estadísticas de feedbacks`);

      // TODO: Descomentar cuando se ejecute la migración de PostgreSQL
      /*
      const [totalCount, statusStats, typeStats, priorityStats] = await Promise.all([
        this.prisma.feedback.count(),
        this.prisma.feedback.groupBy({
          by: ['status'],
          _count: true,
        }),
        this.prisma.feedback.groupBy({
          by: ['feedbackType'],
          _count: true,
        }),
        this.prisma.feedback.groupBy({
          by: ['priority'],
          _count: true,
          orderBy: { priority: 'desc' },
        }),
      ]);

      const stats = {
        total: totalCount,
        byStatus: statusStats.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {}),
        byType: typeStats.reduce((acc, item) => {
          acc[item.feedbackType] = item._count;
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc, item) => {
          acc[`priority_${item.priority}`] = item._count;
          return acc;
        }, {}),
      };
      */

      // Mock temporal para desarrollo
      const stats = {
        total: 12,
        byStatus: {
          PENDING: 8,
          INVESTIGATING: 2,
          RESOLVED: 2,
          WONT_FIX: 0,
        },
        byType: {
          BUG: 5,
          IMPROVEMENT: 3,
          UI_UX: 2,
          PERFORMANCE: 1,
          OTHER: 1,
        },
        byPriority: {
          priority_0: 2,
          priority_1: 3,
          priority_2: 4,
          priority_3: 2,
          priority_4: 1,
          priority_5: 0,
        },
      };

      this.logger.log(
        `📈 [ORÁCULO] Estadísticas generadas (MOCK): ${JSON.stringify(stats, null, 2)}`
      );
      return stats;
    } catch (error) {
      this.logger.error(
        `❌ [ORÁCULO] Error generando estadísticas: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
