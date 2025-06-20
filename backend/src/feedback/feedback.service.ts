import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackReport, FeedbackStatus, FeedbackType } from '../generated/prisma';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crear un nuevo reporte de feedback
   */
  async create(dto: CreateFeedbackDto, userId: string): Promise<FeedbackReport> {
    try {
      const feedbackReport = await this.prisma.feedbackReport.create({
        data: {
          userId,
          type: dto.type,
          title: dto.title,
          description: dto.description,
          priority: dto.priority,
          category: dto.category,
          elementContext: dto.elementContext as any,
          technicalContext: dto.technicalContext as any,
          status: FeedbackStatus.SUBMITTED,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Si se solicita análisis de código, procesarlo de forma asíncrona
      if (dto.requestCodeAnalysis) {
        this.processCodeAnalysis(feedbackReport.id, dto).catch((error) => {
          console.error('Error processing code analysis:', error);
        });
      }

      return feedbackReport;
    } catch (error) {
      console.error('Error creating feedback report:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los reportes de feedback con filtros opcionales
   */
  async findAll(query: {
    status?: FeedbackStatus;
    type?: FeedbackType;
    userId?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const { status, type, userId, limit = 50, offset = 0 } = query;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (userId) where.userId = userId;

    const [reports, total] = await Promise.all([
      this.prisma.feedbackReport.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              avatarUrl: true,
            },
          },
          adminUser: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.feedbackReport.count({ where }),
    ]);

    return {
      reports,
      total,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Obtener un reporte específico por ID
   */
  async findOne(id: string): Promise<FeedbackReport> {
    const report = await this.prisma.feedbackReport.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
        adminUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException(`Feedback report with ID ${id} not found`);
    }

    return report;
  }

  /**
   * Actualizar un reporte de feedback (solo administradores)
   */
  async update(
    id: string,
    dto: UpdateFeedbackDto,
    adminUserId: string,
  ): Promise<FeedbackReport> {
    // Verificar que el reporte existe
    const existingReport = await this.findOne(id);

    const updateData: any = {
      ...dto,
      updatedAt: new Date(),
    };

    // Si se está resolviendo, añadir timestamp y admin
    if (dto.status === FeedbackStatus.RESOLVED) {
      updateData.resolvedAt = new Date();
      updateData.adminUserId = adminUserId;
    }

    // Si se añade respuesta de admin, asignar el administrador
    if (dto.adminResponse) {
      updateData.adminUserId = adminUserId;
    }

    return this.prisma.feedbackReport.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
        adminUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Eliminar un reporte de feedback
   */
  async remove(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const report = await this.findOne(id);

    // Solo el autor o un admin pueden eliminar
    if (!isAdmin && report.userId !== userId) {
      throw new ForbiddenException('You can only delete your own feedback reports');
    }

    await this.prisma.feedbackReport.delete({
      where: { id },
    });
  }

  /**
   * Obtener estadísticas de feedback
   */
  async getStats() {
    const [
      totalReports,
      byStatus,
      byType,
      byPriority,
      recentActivity,
    ] = await Promise.all([
      this.prisma.feedbackReport.count(),
      this.prisma.feedbackReport.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.feedbackReport.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.feedbackReport.groupBy({
        by: ['priority'],
        _count: true,
      }),
      this.prisma.feedbackReport.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      totalReports,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority] = item._count;
        return acc;
      }, {}),
      recentActivity,
    };
  }

  /**
   * Procesar análisis de código de forma asíncrona
   */
  private async processCodeAnalysis(
    feedbackId: string,
    feedbackData: CreateFeedbackDto,
  ): Promise<void> {
    try {
      // Simular análisis de código (aquí se integrarían los scripts reales)
      const mockAnalysis = {
        scriptName: 'feedback-context-analyzer',
        executedAt: new Date().toISOString(),
        results: {
          elementAnalysis: {
            tagName: feedbackData.elementContext.tagName,
            hasId: !!feedbackData.elementContext.id,
            hasClass: !!feedbackData.elementContext.className,
            textLength: feedbackData.elementContext.text?.length || 0,
          },
          routeAnalysis: {
            route: feedbackData.technicalContext.route,
            isProtected: feedbackData.technicalContext.userRoles.length > 0,
            userRoles: feedbackData.technicalContext.userRoles,
          },
          contextSuggestions: [
            'Element is properly identified',
            'Route context captured correctly',
            'User session is valid',
          ],
        },
        executionTime: Math.random() * 1000 + 500, // Mock execution time
      };

      // Actualizar el reporte con el análisis
      await this.prisma.feedbackReport.update({
        where: { id: feedbackId },
        data: {
          codeAnalysis: mockAnalysis,
          status: FeedbackStatus.REVIEWING,
        },
      });

      console.log(`✅ Code analysis completed for feedback ${feedbackId}`);
    } catch (error) {
      console.error(`❌ Code analysis failed for feedback ${feedbackId}:`, error);
    }
  }
}
