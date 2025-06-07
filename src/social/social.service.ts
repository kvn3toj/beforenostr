import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> SocialService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async getSocialStats() {
    console.log('>>> SocialService.getSocialStats: Starting...');
    try {
      console.log('>>> SocialService.getSocialStats: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
      
      // Obtener estadísticas básicas del sistema existente
      const [
        totalUsers,
        totalVideos,
        totalPlaylists
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.videoItem.count(),
        this.prisma.playlist.count()
      ]);

      console.log('>>> SocialService.getSocialStats: Data fetched successfully', {
        totalUsers, totalVideos, totalPlaylists
      });

      // Simular estadísticas sociales basadas en datos existentes
      const result = {
        totalPosts: totalVideos + totalPlaylists,
        totalLikes: Math.floor(totalVideos * 2.5), // Simular likes
        totalComments: Math.floor(totalVideos * 1.8), // Simular comentarios
        totalShares: Math.floor(totalVideos * 0.9), // Simular shares
        totalUsers,
        activeUsers: Math.floor(totalUsers * 0.7) // Simular usuarios activos
      };

      console.log('>>> SocialService.getSocialStats: Returning result', result);
      return result;
    } catch (error) {
      console.error('>>> SocialService.getSocialStats: Error getting social stats:', error);
      // Fallback data
      return {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalUsers: 0,
        activeUsers: 0
      };
    }
  }

  async getRecentActivity() {
    try {
      // Obtener actividad reciente basada en datos existentes
      const recentVideos = await this.prisma.videoItem.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true
            }
          }
        }
      });

      // Convertir a formato de actividad social
      const activities = recentVideos.map((video, index) => ({
        id: `activity_${video.id}`,
        userId: video.creator?.id || 'unknown',
        type: index % 3 === 0 ? 'share' : index % 3 === 1 ? 'like' : 'comment',
        content: video.title,
        createdAt: video.createdAt.toISOString(),
        user: {
          name: video.creator?.name || video.creator?.username || '',
          email: video.creator?.email || '',
          username: video.creator?.username || ''
        }
      }));

      return activities;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }
} 