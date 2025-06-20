import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class SocialService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
// //     console.log('>>> SocialService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async getSocialStats() {
//     console.log('>>> SocialService.getSocialStats: Starting...');
    try {
//       console.log('>>> SocialService.getSocialStats: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

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

      // console.log('>>> SocialService.getSocialStats: Data fetched successfully', {
      //   totalUsers, totalVideos, totalPlaylists
      // });

      // Simular estadísticas sociales basadas en datos existentes
      const result = {
        totalPosts: totalVideos + totalPlaylists,
        totalLikes: Math.floor(totalVideos * 2.5), // Simular likes
        totalComments: Math.floor(totalVideos * 1.8), // Simular comentarios
        totalShares: Math.floor(totalVideos * 0.9), // Simular shares
        totalUsers,
        activeUsers: Math.floor(totalUsers * 0.7) // Simular usuarios activos
      };

//       console.log('>>> SocialService.getSocialStats: Returning result', result);
      return result;
    } catch (error) {
//       console.error('>>> SocialService.getSocialStats: Error getting social stats:', error);
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
      // TODO: Add a creator/user relation to VideoItem in schema.prisma to correctly attribute activities.
      // The current implementation is a placeholder to avoid breaking the social feed.
      const recentVideos = await this.prisma.videoItem.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      // Convertir a formato de actividad social
      const activities = recentVideos.map((video, index) => ({
        id: `activity_${video.id}`,
        userId: 'unknown-user', // Placeholder
        type: index % 3 === 0 ? 'share' : index % 3 === 1 ? 'like' : 'comment',
        content: video.title,
        createdAt: video.createdAt.toISOString(),
        user: {
          name: 'Unknown User', // Placeholder
          email: '',
          username: 'unknown'
        }
      }));

      return activities;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  async findAllPublications() {
//     console.log('>>> SocialService.findAllPublications: Starting...');
    try {
//       console.log('>>> SocialService.findAllPublications: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

      const publications = await this.prisma.publication.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              email: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          },
          comments: {
            take: 3, // Mostrar solo los primeros 3 comentarios
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatarUrl: true
                }
              }
            }
          }
        },
      });

//       console.log('>>> SocialService.findAllPublications: Found', publications.length, 'publications');
      return publications;
    } catch (error) {
//       console.error('>>> SocialService.findAllPublications: Error getting publications:', error);
      throw error;
    }
  }

  async createPublication(dto: CreatePublicationDto, authorId: string) {
//     console.log('>>> SocialService.createPublication: Starting...', { dto, authorId });
    try {
      const publication = await this.prisma.publication.create({
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
              email: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      });

//       console.log('>>> SocialService.createPublication: Created publication with ID:', publication.id);
      return publication;
    } catch (error) {
//       console.error('>>> SocialService.createPublication: Error creating publication:', error);
      throw error;
    }
  }

  async toggleLike(publicationId: string, userId: string) {
//     console.log('>>> SocialService.toggleLike: Starting...', { publicationId, userId });
    try {
      // Verificar que la publicación existe
      const publication = await this.prisma.publication.findUnique({
        where: { id: publicationId }
      });

      if (!publication) {
        throw new NotFoundException('Publicación no encontrada');
      }

      // Buscar si ya existe un like para esta publicación y usuario
      const existingLike = await this.prisma.like.findFirst({
        where: {
          publicationId: publicationId,
          userId: userId
        }
      });

      let liked: boolean;

      if (existingLike) {
        // Si ya existe el like, eliminarlo
        await this.prisma.like.delete({
          where: { id: existingLike.id }
        });
        liked = false;
//         console.log('>>> SocialService.toggleLike: Like removed');
      } else {
        // Si no existe el like, crearlo
        await this.prisma.like.create({
          data: {
            publicationId: publicationId,
            userId: userId
          }
        });
        liked = true;
//         console.log('>>> SocialService.toggleLike: Like added');
      }

      // Obtener el conteo actualizado de likes
      const likesCount = await this.prisma.like.count({
        where: { publicationId: publicationId }
      });

      const result = { liked, likesCount };
//       console.log('>>> SocialService.toggleLike: Result:', result);
      return result;
    } catch (error) {
//       console.error('>>> SocialService.toggleLike: Error toggling like:', error);
      throw error;
    }
  }

  async createComment(publicationId: string, dto: CreateCommentDto, userId: string) {
//     console.log('>>> SocialService.createComment: Starting...', { publicationId, dto, userId });
    try {
      // Verificar que la publicación existe
      const publication = await this.prisma.publication.findUnique({
        where: { id: publicationId }
      });

      if (!publication) {
        throw new NotFoundException('Publicación no encontrada');
      }

      // Crear el comentario
      const comment = await this.prisma.comment.create({
        data: {
          text: dto.content,
          publicationId: publicationId,
          userId: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
              email: true
            }
          }
        }
      });

//       console.log('>>> SocialService.createComment: Created comment with ID:', comment.id);
      return comment;
    } catch (error) {
//       console.error('>>> SocialService.createComment: Error creating comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string, userId: string) {
//     console.log('>>> SocialService.deleteComment: Starting...', { commentId, userId });
    try {
      // Buscar el comentario
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId }
      });

      if (!comment) {
        throw new NotFoundException('Comentario no encontrado');
      }

      // Verificar que el usuario es el autor del comentario
      if (comment.userId !== userId) {
//         console.log('>>> SocialService.deleteComment: Access denied - user is not the author');
        throw new ForbiddenException('Solo puedes eliminar tus propios comentarios');
      }

      // Eliminar el comentario
      await this.prisma.comment.delete({
        where: { id: commentId }
      });

//       console.log('>>> SocialService.deleteComment: Comment deleted successfully');
      return { message: 'Comentario eliminado exitosamente' };
    } catch (error) {
//       console.error('>>> SocialService.deleteComment: Error deleting comment:', error);
      throw error;
    }
  }
}
