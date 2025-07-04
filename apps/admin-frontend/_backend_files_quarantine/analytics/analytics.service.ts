import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserEngagementDto } from './dto/create-user-engagement.dto';
import { UserEngagement } from '@prisma/client'; // Import UserEngagement type from Prisma client

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

  async recordEngagement(data: CreateUserEngagementDto, userId: string): Promise<UserEngagement> {
    return this.prisma.userEngagement.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getUserEngagement(userId: string): Promise<UserEngagement[]> {
    return this.prisma.userEngagement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getContentItemEngagement(contentItemId: string): Promise<UserEngagement[]> {
    return this.prisma.userEngagement.findMany({
      where: { contentItemId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyEngagement(userId: string): Promise<UserEngagement[]> {
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

  async getUsersCreatedOverTime(params: TimeRangeParams): Promise<TimeSeriesDataPoint[]> {
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
      console.warn('[AnalyticsService] Error getting users created over time:', error);
      return [];
    }
  }

  async getPlaylistsCreatedOverTime(params: TimeRangeParams): Promise<TimeSeriesDataPoint[]> {
    try {
      const mockData: TimeSeriesDataPoint[] = [
        { time_period: '2024-01-01', count: 2 },
        { time_period: '2024-01-02', count: 4 },
        { time_period: '2024-01-03', count: 6 },
      ];
      return mockData;
    } catch (error) {
      console.warn('[AnalyticsService] Error getting playlists created over time:', error);
      return [];
    }
  }

  async getMundosCreatedOverTime(params: TimeRangeParams): Promise<TimeSeriesDataPoint[]> {
    try {
      const mockData: TimeSeriesDataPoint[] = [
        { time_period: '2024-01-01', count: 1 },
        { time_period: '2024-01-02', count: 2 },
        { time_period: '2024-01-03', count: 3 },
      ];
      return mockData;
    } catch (error) {
      console.warn('[AnalyticsService] Error getting mundos created over time:', error);
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

      return playlists.map((playlist, index) => ({
        id: playlist.id,
        name: playlist.name,
        view_count: Math.floor(Math.random() * 100) + 10, // Mock view count
        thumbnail_url: undefined,
      }));
    } catch (error) {
      console.warn('[AnalyticsService] Error getting top viewed playlists:', error);
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

      return mundos.map((mundo, index) => ({
        id: mundo.id,
        name: mundo.name,
        view_count: Math.floor(Math.random() * 100) + 10, // Mock view count
        thumbnail_url: undefined,
      }));
    } catch (error) {
      console.warn('[AnalyticsService] Error getting top viewed mundos:', error);
      return [];
    }
  }

  async getActiveUsersOverTime(params: TimeRangeParams): Promise<TimeSeriesDataPoint[]> {
    try {
      const mockData: TimeSeriesDataPoint[] = [
        { time_period: '2024-01-01', count: 15 },
        { time_period: '2024-01-02', count: 22 },
        { time_period: '2024-01-03', count: 18 },
      ];
      return mockData;
    } catch (error) {
      console.warn('[AnalyticsService] Error getting active users over time:', error);
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
      console.warn('[AnalyticsService] Error getting top interacted content:', error);
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
      console.warn('[AnalyticsService] Error getting least viewed playlists:', error);
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
      console.warn('[AnalyticsService] Error getting least viewed mundos:', error);
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
      console.warn('[AnalyticsService] Error getting least interacted playlists:', error);
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
      console.warn('[AnalyticsService] Error getting least interacted mundos:', error);
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
      return {
        topPlaylists: await this.getTopViewedPlaylists(),
        topMundos: await this.getTopViewedMundos(),
        recentActivity: [], // Por implementar
      };
    } catch (error) {
      console.warn('[AnalyticsService] Error getting content stats:', error);
      return {
        topPlaylists: [],
        topMundos: [],
        recentActivity: [],
      };
    }
  }
} 