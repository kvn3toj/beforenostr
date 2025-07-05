import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js.js';
import { CreatePublicationDto } from './dto/create-publication.dto.js.js';
import { CreateCommentDto } from './dto/create-comment.dto.js.js';

@Injectable()
export class SocialService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getSocialStats() {
    const [totalUsers, totalVideos, totalPlaylists] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.videoItem.count(),
      this.prisma.playlist.count(),
    ]);

    return {
      totalPosts: totalVideos + totalPlaylists,
      totalLikes: Math.floor(totalVideos * 2.5),
      totalComments: Math.floor(totalVideos * 1.8),
      totalShares: Math.floor(totalVideos * 0.9),
      totalUsers,
      activeUsers: Math.floor(totalUsers * 0.7),
    };
  }

  async getRecentActivity() {
    const recentVideos = await this.prisma.videoItem.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return recentVideos.map((video, index) => ({
      id: `activity_${video.id}`,
      userId: 'unknown-user', // Placeholder
      type: index % 3 === 0 ? 'share' : index % 3 === 1 ? 'like' : 'comment',
      content: video.title,
      createdAt: video.createdAt.toISOString(),
      user: {
        name: 'Unknown User', // Placeholder
        email: '',
        username: 'unknown',
      },
    }));
  }

  async findAllPublications() {
    return this.prisma.publication.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async createPublication(dto: CreatePublicationDto, authorId: string) {
    return this.prisma.publication.create({
      data: {
        content: dto.content,
        type: dto.type || 'TEXT',
        userId: authorId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async toggleLike(publicationId: string, userId: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const existingLike = await this.prisma.like.findFirst({
      where: {
        publicationId,
        userId,
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      const likesCount = await this.prisma.like.count({
        where: { publicationId },
      });
      return { liked: false, likesCount };
    } else {
      await this.prisma.like.create({
        data: {
          publicationId,
          userId,
        },
      });
      const likesCount = await this.prisma.like.count({
        where: { publicationId },
      });
      return { liked: true, likesCount };
    }
  }

  async createComment(
    publicationId: string,
    dto: CreateCommentDto,
    userId: string
  ) {
    const publication = await this.prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return this.prisma.comment.create({
      data: {
        text: dto.content,
        publicationId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este comentario'
      );
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
