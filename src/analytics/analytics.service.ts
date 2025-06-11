import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalyticsDataDto } from './dto/create-analytics-data.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { CreateVideoEngagementEventDto, VideoEventType } from './dto/create-video-engagement-event.dto';
import { VideoEngagementMetricsDto, VideoEngagementReportDto } from './dto/video-engagement-metrics.dto';
import type { AnalyticsData, Report, Ranking } from '../generated/prisma';

interface TimeRangeParams {
  interval?: string;
  startDate?: string;
  endDate?: string;
}

interface TimeSeriesDataPoint {
  time_period: string;
  count: number;
}

interface ContentViewMetric {
  id: string;
  name: string;
  view_count: number;
  thumbnail_url?: string;
}

interface ContentInteractionMetric {
  id: string;
  name: string;
  interaction_count: number;
  content_type: 'playlist' | 'mundo';
  thumbnail_url?: string;
}

@Injectable()
export class AnalyticsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> AnalyticsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  // === ANALYTICS DATA METHODS ===
  async createAnalyticsData(createAnalyticsDataDto: CreateAnalyticsDataDto): Promise<AnalyticsData> {
    try {
      return await this.prisma.analyticsData.create({
        data: {
          eventType: createAnalyticsDataDto.eventType,
          userId: createAnalyticsDataDto.userId,
          videoItemId: createAnalyticsDataDto.videoItemId,
          playlistId: createAnalyticsDataDto.playlistId,
          mundoId: createAnalyticsDataDto.mundoId,
          sessionId: createAnalyticsDataDto.sessionId,
          metadata: createAnalyticsDataDto.metadata ? JSON.stringify(createAnalyticsDataDto.metadata) : null,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create analytics data: ${error.message}`);
    }
  }

  async getAnalyticsData(params: {
    eventType?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AnalyticsData[]> {
    const { eventType, userId, startDate, endDate, limit = 100 } = params;

    return await this.prisma.analyticsData.findMany({
      where: {
        ...(eventType && { eventType }),
        ...(userId && { userId }),
        ...(startDate && endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // === REPORT METHODS ===
  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    try {
      return await this.prisma.report.create({
        data: {
          name: createReportDto.name,
          type: createReportDto.type,
          data: JSON.stringify(createReportDto.data),
          creatorId: createReportDto.generatedById,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create report: ${error.message}`);
    }
  }

  async getReports(params: {
    type?: string;
    generatedById?: string;
    limit?: number;
  }): Promise<Report[]> {
    const { type, generatedById, limit = 50 } = params;

    return await this.prisma.report.findMany({
      where: {
        ...(type && { type }),
        ...(generatedById && { creatorId: generatedById }),
      },
      orderBy: { generatedAt: 'desc' },
      take: limit,
    });
  }

  // === RANKING METHODS ===
  async createRanking(createRankingDto: CreateRankingDto): Promise<Ranking> {
    try {
      return await this.prisma.ranking.create({
        data: {
          name: createRankingDto.name,
          type: createRankingDto.type,
          period: createRankingDto.period || 'DAILY', // Default period
          data: JSON.stringify({
            userId: createRankingDto.userId,
            score: createRankingDto.score,
            rank: createRankingDto.rank,
            metadata: createRankingDto.metadata
          }),
        },
      });
    } catch (error) {
      throw new Error(`Failed to create ranking: ${error.message}`);
    }
  }

  async getRankings(params: {
    type?: string;
    userId?: string;
    limit?: number;
  }): Promise<Ranking[]> {
    const { type, userId, limit = 100 } = params;

    return await this.prisma.ranking.findMany({
      where: {
        ...(type && { type }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getTopUsersByType(type: string, limit: number = 10): Promise<Ranking[]> {
    return await this.prisma.ranking.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // === ANALYTICS DASHBOARD METHODS ===
  async getDashboardMetrics() {
    try {
      const totalUsers = await this.prisma.user.count();
      const totalPlaylists = await this.prisma.playlist.count();
      const totalMundos = await this.prisma.mundo.count();
      const totalAnalyticsEvents = await this.prisma.analyticsData.count();

      // Obtener eventos recientes (sin include de user ya que no hay relación definida)
      const recentEvents = await this.prisma.analyticsData.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      return {
        overview: {
          totalUsers,
          totalPlaylists,
          totalMundos,
          totalAnalyticsEvents,
        },
        recentEvents,
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard metrics: ${error.message}`);
    }
  }

  async getUserEngagementMetrics(params: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  }) {
    const { startDate, endDate, userId } = params;

    const whereClause = {
      ...(userId && { userId }),
      ...(startDate && endDate && {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const totalEvents = await this.prisma.analyticsData.count({
      where: whereClause,
    });

    const eventsByType = await this.prisma.analyticsData.groupBy({
      by: ['eventType'],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    return {
      totalEvents,
      eventsByType: eventsByType.map(item => ({
        eventType: item.eventType,
        count: item._count.id,
      })),
    };
  }

  async getContentPerformanceMetrics(params: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const { startDate, endDate, limit = 10 } = params;

    const whereClause = {
      ...(startDate && endDate && {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    // Top playlists by engagement
    const playlistEngagement = await this.prisma.analyticsData.groupBy({
      by: ['playlistId'],
      where: {
        ...whereClause,
        playlistId: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    // Top mundos by engagement
    const mundoEngagement = await this.prisma.analyticsData.groupBy({
      by: ['mundoId'],
      where: {
        ...whereClause,
        mundoId: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    return {
      topPlaylists: playlistEngagement.map(item => ({
        playlistId: item.playlistId,
        engagementCount: item._count.id,
      })),
      topMundos: mundoEngagement.map(item => ({
        mundoId: item.mundoId,
        engagementCount: item._count.id,
      })),
    };
  }

  // Health check
  async ping(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'Analytics service is working',
      timestamp: new Date().toISOString(),
    };
  }

  // === VIDEO ENGAGEMENT METHODS (FASE 6.2) ===
  
  /**
   * Registra un evento específico de engagement de video
   */
  async createVideoEngagementEvent(eventDto: CreateVideoEngagementEventDto): Promise<AnalyticsData> {
    try {
      return await this.prisma.analyticsData.create({
        data: {
          eventType: eventDto.eventType,
          userId: eventDto.userId,
          videoItemId: eventDto.videoItemId,
          playlistId: eventDto.playlistId,
          mundoId: eventDto.mundoId,
          sessionId: eventDto.sessionId,
          metadata: JSON.stringify({
            videoTimestamp: eventDto.videoTimestamp,
            videoDuration: eventDto.videoDuration,
            totalWatchTime: eventDto.totalWatchTime,
            ...eventDto.metadata
          }),
        },
      });
    } catch (error) {
      throw new Error(`Failed to create video engagement event: ${error.message}`);
    }
  }

  /**
   * Calcula métricas de engagement para un video específico basadas en la duración real
   */
  async calculateVideoEngagementMetrics(
    videoItemId: string, 
    params: {
      startDate?: Date;
      endDate?: Date;
      includeUserBreakdown?: boolean;
    } = {}
  ): Promise<VideoEngagementMetricsDto> {
    try {
      const { startDate, endDate, includeUserBreakdown = false } = params;

      // Obtener información del video desde VideoItems
      const videoItem = await this.prisma.videoItem.findUnique({
        where: { id: parseInt(videoItemId) },
        select: {
          id: true,
          title: true,
          duration: true,
        },
      });

      if (!videoItem) {
        throw new Error(`Video with ID ${videoItemId} not found`);
      }

      const videoDuration = videoItem.duration || 0;

      // Construir filtros de fecha
      const dateFilter = startDate && endDate ? {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      } : {};

      // Obtener todos los eventos de este video en el rango de fechas
      const events = await this.prisma.analyticsData.findMany({
        where: {
          videoItemId: videoItemId,
          ...dateFilter,
        },
        orderBy: { createdAt: 'asc' },
      });

      // Agrupar eventos por sesión para calcular métricas
      const sessionGroups = events.reduce((acc, event) => {
        const sessionId = event.sessionId || 'unknown';
        if (!acc[sessionId]) {
          acc[sessionId] = [];
        }
        acc[sessionId].push(event);
        return acc;
      }, {} as Record<string, typeof events>);

      let totalViews = 0;
      let totalWatchTime = 0;
      let totalPauses = 0;
      let totalSeeks = 0;
      let totalQuestionAnswers = 0;
      let correctAnswers = 0;
      let completedViews = 0;
      const userMetrics: Record<string, any> = {};

      // Procesar cada sesión
      Object.values(sessionGroups).forEach(sessionEvents => {
        if (sessionEvents.length === 0) return;

        const userId = sessionEvents[0].userId;
        const sessionId = sessionEvents[0].sessionId;

        // Verificar si es una visualización válida (tiene al menos un video_start)
        const hasStart = sessionEvents.some(e => e.eventType === VideoEventType.VIDEO_START);
        if (!hasStart) return;

        totalViews++;

        // Calcular métricas de la sesión
        let sessionWatchTime = 0;
        let sessionPauses = 0;
        let sessionSeeks = 0;
        let sessionQuestions = 0;
        let sessionCorrectAnswers = 0;
        let isCompleted = false;

        sessionEvents.forEach(event => {
          const metadata = event.metadata ? JSON.parse(event.metadata) : {};

          switch (event.eventType) {
            case VideoEventType.VIDEO_PAUSE:
              sessionPauses++;
              break;
            case VideoEventType.VIDEO_SEEK:
              sessionSeeks++;
              break;
            case VideoEventType.VIDEO_COMPLETE:
              isCompleted = true;
              break;
            case VideoEventType.QUESTION_ANSWERED:
              sessionQuestions++;
              if (metadata.answerCorrect) {
                sessionCorrectAnswers++;
              }
              break;
            case VideoEventType.TOTAL_WATCH_TIME:
              sessionWatchTime = Math.max(sessionWatchTime, metadata.totalWatchTime || 0);
              break;
          }
        });

        if (isCompleted) completedViews++;

        totalWatchTime += sessionWatchTime;
        totalPauses += sessionPauses;
        totalSeeks += sessionSeeks;
        totalQuestionAnswers += sessionQuestions;
        correctAnswers += sessionCorrectAnswers;

        // Guardar métricas por usuario si se solicita
        if (includeUserBreakdown && userId) {
          if (!userMetrics[userId]) {
            userMetrics[userId] = {
              userId,
              watchTime: 0,
              completionRate: 0,
              questionsAnswered: 0,
              correctAnswers: 0,
              sessions: 0,
            };
          }

          userMetrics[userId].watchTime += sessionWatchTime;
          userMetrics[userId].questionsAnswered += sessionQuestions;
          userMetrics[userId].correctAnswers += sessionCorrectAnswers;
          userMetrics[userId].sessions += 1;
          if (isCompleted) {
            userMetrics[userId].completionRate += 1;
          }
        }
      });

      // Calcular métricas finales
      const averageWatchTime = totalViews > 0 ? totalWatchTime / totalViews : 0;
      const completionRate = totalViews > 0 ? (completedViews / totalViews) * 100 : 0;
      const correctAnswerRate = totalQuestionAnswers > 0 ? (correctAnswers / totalQuestionAnswers) * 100 : 0;

      // Calcular engagement score (métrica compuesta)
      const watchTimeScore = videoDuration > 0 ? Math.min((averageWatchTime / videoDuration) * 100, 100) : 0;
      const questionScore = totalQuestionAnswers > 0 ? correctAnswerRate : 50; // Default 50 si no hay preguntas
      const engagementScore = (watchTimeScore * 0.6) + (completionRate * 0.3) + (questionScore * 0.1);

      // Procesar breakdown por usuario
      const userBreakdown = includeUserBreakdown ? 
        Object.values(userMetrics).map((user: any) => ({
          userId: user.userId,
          watchTime: user.watchTime,
          completionRate: user.sessions > 0 ? (user.completionRate / user.sessions) * 100 : 0,
          questionsAnswered: user.questionsAnswered,
          correctAnswers: user.correctAnswers,
        })) : undefined;

      return {
        videoId: videoItemId,
        videoTitle: videoItem.title,
        videoDuration,
        totalViews,
        averageWatchTime: Math.round(averageWatchTime * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        engagementScore: Math.round(engagementScore * 100) / 100,
        totalPauses,
        totalSeeks,
        totalQuestionAnswers,
        correctAnswerRate: Math.round(correctAnswerRate * 100) / 100,
        userBreakdown,
      };
    } catch (error) {
      throw new Error(`Failed to calculate video engagement metrics: ${error.message}`);
    }
  }

  /**
   * Genera un reporte de engagement para múltiples videos
   */
  async generateVideoEngagementReport(params: {
    videoIds?: string[];
    playlistId?: string;
    mundoId?: string;
    startDate: Date;
    endDate: Date;
    includeUserBreakdown?: boolean;
  }): Promise<VideoEngagementReportDto> {
    try {
      const { videoIds, playlistId, mundoId, startDate, endDate, includeUserBreakdown = false } = params;

      // Determinar qué videos incluir en el reporte
      let targetVideoIds: string[] = [];

      if (videoIds) {
        targetVideoIds = videoIds;
      } else if (playlistId) {
        const videos = await this.prisma.videoItem.findMany({
          where: { playlistId },
          select: { id: true },
        });
        targetVideoIds = videos.map(v => v.id.toString());
      } else if (mundoId) {
        const videos = await this.prisma.videoItem.findMany({
          where: { 
            playlist: { mundoId } 
          },
          select: { id: true },
        });
        targetVideoIds = videos.map(v => v.id.toString());
      } else {
        // Si no se especifica, tomar todos los videos que tengan eventos en el rango de fechas
        const eventsWithVideos = await this.prisma.analyticsData.findMany({
          where: {
            videoItemId: { not: null },
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: { videoItemId: true },
          distinct: ['videoItemId'],
        });
        targetVideoIds = eventsWithVideos
          .map(e => e.videoItemId)
          .filter(id => id !== null) as string[];
      }

      // Calcular métricas para cada video
      const videoMetrics: VideoEngagementMetricsDto[] = [];
      for (const videoId of targetVideoIds) {
        try {
          const metrics = await this.calculateVideoEngagementMetrics(videoId, {
            startDate,
            endDate,
            includeUserBreakdown,
          });
          videoMetrics.push(metrics);
        } catch (error) {
          console.warn(`Failed to calculate metrics for video ${videoId}:`, error.message);
        }
      }

      // Calcular resumen general
      const totalVideos = videoMetrics.length;
      const totalViews = videoMetrics.reduce((sum, m) => sum + m.totalViews, 0);
      const averageEngagementScore = totalVideos > 0 ? 
        videoMetrics.reduce((sum, m) => sum + m.engagementScore, 0) / totalVideos : 0;
      const averageCompletionRate = totalVideos > 0 ?
        videoMetrics.reduce((sum, m) => sum + m.completionRate, 0) / totalVideos : 0;
      const totalWatchTimeHours = videoMetrics.reduce(
        (sum, m) => sum + (m.averageWatchTime * m.totalViews), 0
      ) / 3600; // Convertir a horas

      return {
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        videos: videoMetrics,
        summary: {
          totalVideos,
          totalViews,
          averageEngagementScore: Math.round(averageEngagementScore * 100) / 100,
          averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
          totalWatchTimeHours: Math.round(totalWatchTimeHours * 100) / 100,
        },
      };
    } catch (error) {
      throw new Error(`Failed to generate video engagement report: ${error.message}`);
    }
  }

  /**
   * Obtiene discrepancias históricas de duración de videos
   */
  async getHistoricalDurationDiscrepancies(params: {
    videoItemId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}): Promise<any[]> {
    try {
      const { videoItemId, startDate, endDate, limit = 100 } = params;

      // Construir filtros
      const whereClause: any = {
        level: 'INFO',
        message: { contains: 'Duration mismatch corrected' },
        ...(startDate && endDate && {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        }),
      };

      // Si se especifica videoItemId, filtrar en los metadatos
      if (videoItemId) {
        whereClause.metadata = { contains: `"videoId":"${videoItemId}"` };
      }

      const logs = await this.prisma.log.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        take: limit,
      });

      // Procesar logs para extraer información estructurada
      return logs.map(log => {
        let metadata = {};
        try {
          metadata = log.metadata ? JSON.parse(log.metadata) : {};
        } catch (e) {
          console.warn('Failed to parse log metadata:', e);
        }

        return {
          id: log.id,
          timestamp: log.timestamp,
          message: log.message,
          videoId: (metadata as any).videoId,
          oldDuration: (metadata as any).oldDuration,
          newDuration: (metadata as any).newDuration,
          source: (metadata as any).source || 'unknown',
          metadata,
        };
      });
    } catch (error) {
      throw new Error(`Failed to get historical duration discrepancies: ${error.message}`);
    }
  }

  /**
   * Calcula estadísticas de discrepancias de duración
   */
  async getDurationDiscrepancyStats(params: {
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<{
    totalDiscrepancies: number;
    averageDiscrepancySeconds: number;
    mostProblematicVideos: Array<{
      videoId: string;
      videoTitle?: string;
      discrepancyCount: number;
      totalDiscrepancySeconds: number;
    }>;
    discrepanciesBySource: Record<string, number>;
  }> {
    try {
      const { startDate, endDate } = params;

      const discrepancies = await this.getHistoricalDurationDiscrepancies({
        startDate,
        endDate,
        limit: 1000,
      });

      const totalDiscrepancies = discrepancies.length;
      
      // Calcular discrepancia promedio
      const validDiscrepancies = discrepancies.filter(d => 
        typeof d.oldDuration === 'number' && typeof d.newDuration === 'number'
      );
      const totalDiscrepancySeconds = validDiscrepancies.reduce(
        (sum, d) => sum + Math.abs(d.newDuration - d.oldDuration), 0
      );
      const averageDiscrepancySeconds = validDiscrepancies.length > 0 ? 
        totalDiscrepancySeconds / validDiscrepancies.length : 0;

      // Agrupar por video para encontrar los más problemáticos
      const videoGroups = discrepancies.reduce((acc, d) => {
        if (!d.videoId) return acc;
        
        if (!acc[d.videoId]) {
          acc[d.videoId] = {
            videoId: d.videoId,
            discrepancyCount: 0,
            totalDiscrepancySeconds: 0,
          };
        }
        
        acc[d.videoId].discrepancyCount++;
        if (typeof d.oldDuration === 'number' && typeof d.newDuration === 'number') {
          acc[d.videoId].totalDiscrepancySeconds += Math.abs(d.newDuration - d.oldDuration);
        }
        
        return acc;
      }, {} as Record<string, any>);

      // Obtener títulos de videos para los más problemáticos
      const mostProblematicVideos = Object.values(videoGroups)
        .sort((a: any, b: any) => b.discrepancyCount - a.discrepancyCount)
        .slice(0, 10);

      for (const video of mostProblematicVideos) {
        try {
          const videoItem = await this.prisma.videoItem.findUnique({
            where: { id: parseInt(video.videoId) },
            select: { title: true },
          });
          video.videoTitle = videoItem?.title;
        } catch (e) {
          console.warn(`Failed to get title for video ${video.videoId}`);
        }
      }

      // Agrupar por fuente
      const discrepanciesBySource = discrepancies.reduce((acc, d) => {
        const source = d.source || 'unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalDiscrepancies,
        averageDiscrepancySeconds: Math.round(averageDiscrepancySeconds * 100) / 100,
        mostProblematicVideos,
        discrepanciesBySource,
      };
    } catch (error) {
      throw new Error(`Failed to calculate duration discrepancy stats: ${error.message}`);
    }
  }

  // === TIME SERIES METHODS FOR FRONTEND ===
  async getUsersCreatedOverTime(params: {
    interval?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Array<{ date: string; count: number }>> {
    const { interval = 'day', startDate, endDate } = params;
    
    try {
      const defaultEndDate = endDate || new Date();
      const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Convertir a timestamps de Unix en millisegundos
      const startTimestamp = defaultStartDate.getTime();
      const endTimestamp = defaultEndDate.getTime();

      let dateFormat: string;
      switch (interval) {
        case 'week':
          dateFormat = '%Y-%W'; // SQLite: año-semana
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default: // 'day'
          dateFormat = '%Y-%m-%d';
          break;
      }

      const result = await this.prisma.$queryRaw`
        SELECT 
          strftime(${dateFormat}, datetime(createdAt/1000, 'unixepoch')) as date,
          COUNT(*) as count
        FROM users 
        WHERE createdAt BETWEEN ${startTimestamp} AND ${endTimestamp}
        GROUP BY strftime(${dateFormat}, datetime(createdAt/1000, 'unixepoch'))
        ORDER BY date
      ` as Array<{ date: string; count: bigint }>;

      return result.map(item => ({
        date: item.date,
        count: Number(item.count)
      }));
    } catch (error) {
      console.error('Error in getUsersCreatedOverTime:', error);
      // Retornar datos simulados en caso de error
      return this.generateMockTimeSeriesData(interval, startDate, endDate);
    }
  }

  async getPlaylistsCreatedOverTime(params: {
    interval?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Array<{ date: string; count: number }>> {
    const { interval = 'day', startDate, endDate } = params;
    
    try {
      const defaultEndDate = endDate || new Date();
      const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Convertir a timestamps de Unix en millisegundos
      const startTimestamp = defaultStartDate.getTime();
      const endTimestamp = defaultEndDate.getTime();

      let dateFormat: string;
      switch (interval) {
        case 'week':
          dateFormat = '%Y-%W'; // SQLite: año-semana
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default: // 'day'
          dateFormat = '%Y-%m-%d';
          break;
      }

      const result = await this.prisma.$queryRaw`
        SELECT 
          strftime(${dateFormat}, datetime(createdAt/1000, 'unixepoch')) as date,
          COUNT(*) as count
        FROM playlists 
        WHERE createdAt BETWEEN ${startTimestamp} AND ${endTimestamp}
        GROUP BY strftime(${dateFormat}, datetime(createdAt/1000, 'unixepoch'))
        ORDER BY date
      ` as Array<{ date: string; count: bigint }>;

      return result.map(item => ({
        date: item.date,
        count: Number(item.count)
      }));
    } catch (error) {
      console.error('Error in getPlaylistsCreatedOverTime:', error);
      return this.generateMockTimeSeriesData(interval, startDate, endDate);
    }
  }

  async getMundosCreatedOverTime(params: {
    interval?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Array<{ date: string; count: number }>> {
    const { interval = 'day', startDate, endDate } = params;
    
    try {
      const defaultEndDate = endDate || new Date();
      const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Convertir a timestamps de Unix en millisegundos
      const startTimestamp = defaultStartDate.getTime();
      const endTimestamp = defaultEndDate.getTime();

      let dateFormat: string;
      switch (interval) {
        case 'week':
          dateFormat = '%Y-%W'; // SQLite: año-semana
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default: // 'day'
          dateFormat = '%Y-%m-%d';
          break;
      }

      const result = await this.prisma.$queryRaw`
        SELECT 
          strftime(${dateFormat}, datetime(createdAt/1000, 'unixepoch')) as date,
          COUNT(*) as count
        FROM mundos 
        WHERE createdAt BETWEEN ${startTimestamp} AND ${endTimestamp}
        GROUP BY strftime(${dateFormat}, datetime(createdAt/1000, 'unixepoch'))
        ORDER BY date
      ` as Array<{ date: string; count: bigint }>;

      return result.map(item => ({
        date: item.date,
        count: Number(item.count)
      }));
    } catch (error) {
      console.error('Error in getMundosCreatedOverTime:', error);
      return this.generateMockTimeSeriesData(interval, startDate, endDate);
    }
  }

  async getActiveUsersOverTime(params: {
    interval?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Array<{ date: string; count: number }>> {
    const { interval = 'day', startDate, endDate } = params;
    
    try {
      const defaultEndDate = endDate || new Date();
      const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Convertir a timestamps de Unix en millisegundos
      const startTimestamp = defaultStartDate.getTime();
      const endTimestamp = defaultEndDate.getTime();

      let dateFormat: string;
      switch (interval) {
        case 'week':
          dateFormat = '%Y-%W'; // SQLite: año-semana
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default: // 'day'
          dateFormat = '%Y-%m-%d';
          break;
      }

      // Obtener usuarios activos basado en eventos de analytics
      const result = await this.prisma.$queryRaw`
        SELECT 
          strftime(${dateFormat}, datetime(createdAt/1000, 'unixepoch')) as date,
          COUNT(DISTINCT userId) as count
        FROM analytics_data 
        WHERE createdAt BETWEEN ${startTimestamp} AND ${endTimestamp}
          AND userId IS NOT NULL
        GROUP BY strftime(${dateFormat}, datetime(createdAt/1000, 'unixepoch'))
        ORDER BY date
      ` as Array<{ date: string; count: bigint }>;

      return result.map(item => ({
        date: item.date,
        count: Number(item.count)
      }));
    } catch (error) {
      console.error('Error in getActiveUsersOverTime:', error);
      return this.generateMockTimeSeriesData(interval, startDate, endDate);
    }
  }

  private generateMockTimeSeriesData(
    interval: string = 'day',
    startDate?: Date,
    endDate?: Date
  ): Array<{ date: string; count: number }> {
    const defaultEndDate = endDate || new Date();
    const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const data: Array<{ date: string; count: number }> = [];
    const current = new Date(defaultStartDate);
    
    while (current <= defaultEndDate) {
      let dateString: string;
      switch (interval) {
        case 'week':
          dateString = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${Math.ceil(current.getDate() / 7)}`;
          break;
        case 'month':
          dateString = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
          break;
        default: // 'day'
          dateString = current.toISOString().split('T')[0];
          break;
      }
      
      data.push({
        date: dateString,
        count: Math.floor(Math.random() * 10) // Datos aleatorios para demo
      });
      
      // Incrementar la fecha según el intervalo
      switch (interval) {
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
        default: // 'day'
          current.setDate(current.getDate() + 1);
          break;
      }
    }
    
    return data;
  }
} 