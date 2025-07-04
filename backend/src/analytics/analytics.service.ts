import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserEngagementDto } from './dto/create-user-engagement.dto';
import { Activity } from '../generated/prisma'; // Use Activity from generated Prisma

interface TimeRangeParams {
  interval?: string;
  startDate?: string;
  endDate?: string;
}

export interface TimeSeriesDataPoint {
  time_period: string;
  count: number;
}

export interface ContentViewMetric {
  id: string;
  name: string;
  view_count: number;
  thumbnail_url?: string;
}

export interface ContentInteractionMetric {
  id: string;
  name: string;
  interaction_count: number;
  content_type: 'playlist' | 'mundo';
  thumbnail_url?: string;
}

@Injectable()
export class AnalyticsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // //     console.log('>>> AnalyticsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async recordEngagement(
    data: CreateUserEngagementDto,
    userId: string
  ): Promise<Activity> {
    return this.prisma.activity.create({
      data: {
        title: `User Engagement - ${data.eventType}`,
        description: data.eventData
          ? JSON.stringify(data.eventData)
          : undefined,
        type: data.eventType,
        creatorId: userId,
        experienceId: data.contentItemId || 'default-experience-id', // Use contentItemId from DTO
        status: 'ACTIVE',
      },
    });
  }

  async getUserEngagement(userId: string): Promise<Activity[]> {
    return this.prisma.activity.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getContentItemEngagement(contentItemId: string): Promise<Activity[]> {
    return this.prisma.activity.findMany({
      where: { experienceId: contentItemId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyEngagement(userId: string): Promise<Activity[]> {
    // This method is essentially the same as getUserEngagement but provided for controller clarity
    return this.getUserEngagement(userId);
  }

  async getTotalUsers(): Promise<{ count: number }> {
    try {
      const count = await this.prisma.user.count();
      return { count };
    } catch (error) {
      console.warn('[AnalyticsService] Error getting total users:', error);
      return { count: 0 };
    }
  }

  async getTotalPlaylists(): Promise<{ count: number }> {
    try {
      const count = await this.prisma.playlist.count();
      return { count };
    } catch (error) {
      console.warn('[AnalyticsService] Error getting total playlists:', error);
      return { count: 0 };
    }
  }

  async getTotalMundos(): Promise<{ count: number }> {
    try {
      const count = await this.prisma.mundo.count();
      return { count };
    } catch (error) {
      console.warn('[AnalyticsService] Error getting total mundos:', error);
      return { count: 0 };
    }
  }

  async getUsersCreatedOverTime(
    _params: TimeRangeParams
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      // Por ahora devolvemos datos mock, pero aquí se implementaría la lógica real
      // usando agregaciones de Prisma con fechas
      const mockData: TimeSeriesDataPoint[] = [
        { time_period: '2024-01-01', count: 5 },
        { time_period: '2024-01-02', count: 8 },
        { time_period: '2024-01-03', count: 12 },
      ];
      return mockData;
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting users created over time:',
        error
      );
      return [];
    }
  }

  async getPlaylistsCreatedOverTime(
    _params: TimeRangeParams
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      const mockData: TimeSeriesDataPoint[] = [
        { time_period: '2024-01-01', count: 2 },
        { time_period: '2024-01-02', count: 4 },
        { time_period: '2024-01-03', count: 6 },
      ];
      return mockData;
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting playlists created over time:',
        error
      );
      return [];
    }
  }

  async getMundosCreatedOverTime(
    _params: TimeRangeParams
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      const mockData: TimeSeriesDataPoint[] = [
        { time_period: '2024-01-01', count: 1 },
        { time_period: '2024-01-02', count: 2 },
        { time_period: '2024-01-03', count: 3 },
      ];
      return mockData;
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting mundos created over time:',
        error
      );
      return [];
    }
  }

  async getTopViewedPlaylists(): Promise<ContentViewMetric[]> {
    try {
      // Implementación básica usando datos reales de playlists
      const playlists = await this.prisma.playlist.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      return playlists.map((playlist, _index) => ({
        id: playlist.id,
        name: playlist.name,
        view_count: Math.floor(Math.random() * 100) + 10, // Mock view count
        thumbnail_url: undefined,
      }));
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting top viewed playlists:',
        error
      );
      return [];
    }
  }

  async getTopViewedMundos(): Promise<ContentViewMetric[]> {
    try {
      const mundos = await this.prisma.mundo.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      return mundos.map((mundo, _index) => ({
        id: mundo.id,
        name: mundo.name,
        view_count: Math.floor(Math.random() * 100) + 10, // Mock view count
        thumbnail_url: undefined,
      }));
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting top viewed mundos:',
        error
      );
      return [];
    }
  }

  async getActiveUsersOverTime(
    _params: TimeRangeParams
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      const mockData: TimeSeriesDataPoint[] = [
        { time_period: '2024-01-01', count: 15 },
        { time_period: '2024-01-02', count: 22 },
        { time_period: '2024-01-03', count: 18 },
      ];
      return mockData;
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting active users over time:',
        error
      );
      return [];
    }
  }

  async getTopInteractedContent(): Promise<ContentInteractionMetric[]> {
    try {
      const mockData: ContentInteractionMetric[] = [
        {
          id: '1',
          name: 'Popular Playlist',
          interaction_count: 45,
          content_type: 'playlist',
        },
        {
          id: '2',
          name: 'Trending Mundo',
          interaction_count: 38,
          content_type: 'mundo',
        },
      ];
      return mockData;
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting top interacted content:',
        error
      );
      return [];
    }
  }

  async getLeastViewedPlaylists(): Promise<ContentViewMetric[]> {
    try {
      const playlists = await this.prisma.playlist.findMany({
        take: 10,
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      return playlists.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        view_count: Math.floor(Math.random() * 10) + 1, // Mock low view count
        thumbnail_url: undefined,
      }));
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting least viewed playlists:',
        error
      );
      return [];
    }
  }

  async getLeastViewedMundos(): Promise<ContentViewMetric[]> {
    try {
      const mundos = await this.prisma.mundo.findMany({
        take: 10,
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      return mundos.map((mundo) => ({
        id: mundo.id,
        name: mundo.name,
        view_count: Math.floor(Math.random() * 10) + 1, // Mock low view count
        thumbnail_url: undefined,
      }));
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting least viewed mundos:',
        error
      );
      return [];
    }
  }

  async getLeastInteractedPlaylists(): Promise<ContentInteractionMetric[]> {
    try {
      const mockData: ContentInteractionMetric[] = [
        {
          id: '3',
          name: 'Low Interaction Playlist',
          interaction_count: 2,
          content_type: 'playlist',
        },
      ];
      return mockData;
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting least interacted playlists:',
        error
      );
      return [];
    }
  }

  async getLeastInteractedMundos(): Promise<ContentInteractionMetric[]> {
    try {
      const mockData: ContentInteractionMetric[] = [
        {
          id: '4',
          name: 'Low Interaction Mundo',
          interaction_count: 1,
          content_type: 'mundo',
        },
      ];
      return mockData;
    } catch (error) {
      console.warn(
        '[AnalyticsService] Error getting least interacted mundos:',
        error
      );
      return [];
    }
  }

  async getSystemStats() {
    try {
      const [totalUsers, totalPlaylists, totalMundos] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.playlist.count(),
        this.prisma.mundo.count(),
      ]);

      return {
        totalUsers,
        totalMundos,
        totalPlaylists,
        totalVideos: 0, // Por implementar cuando tengamos videos
      };
    } catch (error) {
      console.warn('[AnalyticsService] Error getting system stats:', error);
      return {
        totalUsers: 0,
        totalMundos: 0,
        totalPlaylists: 0,
        totalVideos: 0,
      };
    }
  }

  async getUserStats() {
    try {
      const totalUsers = await this.prisma.user.count();
      const recentUsers = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
          },
        },
      });

      return {
        activeUsers: totalUsers,
        newUsers: recentUsers,
        topUsers: [], // Por implementar
      };
    } catch (error) {
      console.warn('[AnalyticsService] Error getting user stats:', error);
      return {
        activeUsers: 0,
        newUsers: 0,
        topUsers: [],
      };
    }
  }

  async getContentStats() {
    try {
      const totalPlaylists = await this.prisma.playlist.count();
      const totalMundos = await this.prisma.mundo.count();
      const totalContentItems = await this.prisma.contentItem.count();

      return {
        total_playlists: totalPlaylists,
        total_mundos: totalMundos,
        total_content_items: totalContentItems,
        total_content: totalPlaylists + totalMundos + totalContentItems,
      };
    } catch (error) {
      console.warn('[AnalyticsService] Error getting content stats:', error);
      return {
        total_playlists: 0,
        total_mundos: 0,
        total_content_items: 0,
        total_content: 0,
      };
    }
  }

  async getVideoAnalytics() {
    try {
      // TODO: Implementar lógica real con agregaciones de Prisma
      // Por ahora devolvemos datos simulados con la estructura correcta

      // Intentar obtener el conteo real de videos
      let totalVideos = 42; // Valor por defecto
      try {
        const videoCount = await this.prisma.contentItem.count();
        totalVideos = videoCount > 0 ? videoCount : 42;
      } catch (_dbError) {
        console.warn(
          '[AnalyticsService] Could not fetch video count from DB, using mock data'
        );
      }

      return {
        totalViews: 10500,
        averageWatchTime: 180, // en segundos
        mostViewedVideo: 'Introducción a la Gamificación',
        totalQuestionsAnswered: 5320,
        totalVideos,
        topVideos: [
          {
            id: '1',
            title: 'Introducción a la Gamificación',
            views: 2500,
            duration: 300,
          },
          {
            id: '2',
            title: 'Principios de Reciprocidad',
            views: 1800,
            duration: 240,
          },
          {
            id: '3',
            title: 'Economía Colaborativa',
            views: 1200,
            duration: 420,
          },
        ],
        viewsByDay: [
          { date: '2024-01-01', views: 150 },
          { date: '2024-01-02', views: 200 },
          { date: '2024-01-03', views: 180 },
          { date: '2024-01-04', views: 220 },
          { date: '2024-01-05', views: 190 },
        ],
      };
    } catch (error) {
      console.warn('[AnalyticsService] Error getting video analytics:', error);
      return {
        totalViews: 0,
        averageWatchTime: 0,
        mostViewedVideo: 'N/A',
        totalQuestionsAnswered: 0,
        totalVideos: 0,
        topVideos: [],
        viewsByDay: [],
      };
    }
  }

  // Nuevos métodos requeridos por el reporte de integración
  async getDashboardMetrics() {
    try {
      console.log('[AnalyticsService] Getting dashboard metrics...');

      // Obtener métricas básicas del sistema
      const [
        totalUsers,
        totalPlaylists,
        totalMundos,
        totalContentItems,
        recentEngagement,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.playlist.count(),
        this.prisma.mundo.count(),
        this.prisma.contentItem.count(),
        this.prisma.activity.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { creator: { select: { name: true, email: true } } },
        }),
      ]);

      // Calcular usuarios activos (últimos 7 días) - usando actividades como proxy
      const activeUsers = await this.prisma.user.count({
        where: {
          createdActivities: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      });

      const totalContent = totalPlaylists + totalMundos + totalContentItems;

      // Métricas de Reciprocidad (simuladas por ahora)
      const reciprocidadMetrics = {
        totalLukas: Math.floor(Math.random() * 10000) + 5000,
        totalOndas: Math.floor(Math.random() * 50000) + 25000,
        reciprocidadBalance: {
          given: Math.floor(Math.random() * 1000) + 500,
          received: Math.floor(Math.random() * 1000) + 500,
        },
        trustLevel: Math.random() * 5 + 3, // Entre 3-8
      };

      // Actividad reciente
      const recentActivity = recentEngagement.map((engagement) => ({
        id: engagement.id,
        type: engagement.type,
        user: engagement.creator?.name || 'Usuario Anónimo',
        timestamp: engagement.createdAt,
        details: engagement.description,
      }));

      return {
        timestamp: new Date().toISOString(),
        totalUsers,
        activeUsers,
        totalContent,
        breakdown: {
          playlists: totalPlaylists,
          mundos: totalMundos,
          contentItems: totalContentItems,
        },
        engagement: {
          totalEvents: recentEngagement.length,
          recentEvents: recentEngagement.length,
        },
        recentActivity: recentActivity.slice(0, 5), // Últimas 5 actividades
        reciprocidadMetrics,
        summary: {
          userGrowth: Math.floor(Math.random() * 20) + 5, // % crecimiento simulado
          engagementRate: Math.random() * 30 + 70, // % entre 70-100
          contentUtilization: totalContent > 0 ? Math.random() * 40 + 60 : 0, // % entre 60-100
        },
      };
    } catch (error) {
      console.error(
        '[AnalyticsService] Error getting dashboard metrics:',
        error
      );
      return {
        timestamp: new Date().toISOString(),
        totalUsers: 0,
        activeUsers: 0,
        totalContent: 0,
        breakdown: { playlists: 0, mundos: 0, contentItems: 0 },
        engagement: { totalEvents: 0, recentEvents: 0 },
        recentActivity: [],
        reciprocidadMetrics: {
          totalLukas: 0,
          totalOndas: 0,
          reciprocidadBalance: { given: 0, received: 0 },
          trustLevel: 0,
        },
        summary: {
          userGrowth: 0,
          engagementRate: 0,
          contentUtilization: 0,
        },
      };
    }
  }

  async getSystemHealth() {
    try {
      console.log('[AnalyticsService] Checking system health...');

      const startTime = Date.now();
      let databaseStatus = 'healthy';
      let dbResponseTime = 0;

      // Test database connection
      try {
        const dbStart = Date.now();
        await this.prisma.$queryRaw`SELECT 1`;
        dbResponseTime = Date.now() - dbStart;

        if (dbResponseTime > 1000) {
          databaseStatus = 'warning';
        } else if (dbResponseTime > 2000) {
          databaseStatus = 'critical';
        }
      } catch (_dbError) {
        console.error(
          '[AnalyticsService] Database health check failed:',
          _dbError
        );
        databaseStatus = 'critical';
        dbResponseTime = -1;
      }

      // Memory usage (simulated - in real app would use process.memoryUsage())
      const memoryUsage = {
        used: Math.floor(Math.random() * 500) + 200, // MB
        total: 1024, // MB
        percentage: Math.floor(Math.random() * 50 + 20), // 20-70%
      };

      // Determine overall health status
      let overallStatus = 'healthy';
      if (databaseStatus === 'critical' || memoryUsage.percentage > 90) {
        overallStatus = 'critical';
      } else if (databaseStatus === 'warning' || memoryUsage.percentage > 75) {
        overallStatus = 'warning';
      }

      // System uptime (simulated)
      const uptime = Math.floor(Math.random() * 86400) + 3600; // 1-24 hours in seconds

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime,
        services: {
          database: {
            status: databaseStatus,
            responseTime: dbResponseTime,
            connection: databaseStatus !== 'critical',
          },
          cache: {
            status: 'healthy', // Simulated
            responseTime: Math.floor(Math.random() * 50) + 5,
          },
          api: {
            status: 'healthy',
            responseTime: Date.now() - startTime,
          },
        },
        resources: {
          memory: memoryUsage,
          cpu: {
            usage: Math.floor(Math.random() * 60) + 10, // 10-70%
            load: Math.random() * 2 + 0.5, // 0.5-2.5
          },
        },
        metrics: {
          activeConnections: Math.floor(Math.random() * 100) + 10,
          requestsPerMinute: Math.floor(Math.random() * 500) + 50,
          errorRate: Math.random() * 5, // 0-5%
        },
        lastHealthCheck: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[AnalyticsService] Error checking system health:', error);
      return {
        status: 'critical',
        timestamp: new Date().toISOString(),
        uptime: 0,
        services: {
          database: { status: 'critical', responseTime: -1, connection: false },
          cache: { status: 'unknown', responseTime: -1 },
          api: { status: 'critical', responseTime: -1 },
        },
        resources: {
          memory: { used: 0, total: 0, percentage: 0 },
          cpu: { usage: 0, load: 0 },
        },
        metrics: {
          activeConnections: 0,
          requestsPerMinute: 0,
          errorRate: 100,
        },
        lastHealthCheck: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
