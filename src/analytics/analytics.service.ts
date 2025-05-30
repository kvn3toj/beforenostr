import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalyticsDataDto } from './dto/create-analytics-data.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { CreateRankingDto } from './dto/create-ranking.dto';
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
  constructor(private readonly prisma: PrismaService) {
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
          description: createReportDto.description,
          data: JSON.stringify(createReportDto.data),
          generatedById: createReportDto.generatedById,
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
        ...(generatedById && { generatedById }),
      },
      orderBy: { createdAt: 'desc' },
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
          userId: createRankingDto.userId,
          score: createRankingDto.score,
          rank: createRankingDto.rank,
          metadata: createRankingDto.metadata ? JSON.stringify(createRankingDto.metadata) : null,
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
        ...(userId && { userId }),
      },
      orderBy: { rank: 'asc' },
      take: limit,
    });
  }

  async getTopUsersByType(type: string, limit: number = 10): Promise<Ranking[]> {
    return await this.prisma.ranking.findMany({
      where: { type },
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // === ANALYTICS DASHBOARD METHODS ===
  async getDashboardMetrics() {
    try {
      const totalUsers = await this.prisma.user.count();
      const totalPlaylists = await this.prisma.playlist.count();
      const totalMundos = await this.prisma.mundo.count();
      const totalAnalyticsEvents = await this.prisma.analyticsData.count();

      // Obtener eventos recientes
      const recentEvents = await this.prisma.analyticsData.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
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
} 