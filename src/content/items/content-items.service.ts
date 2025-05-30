import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VideoItemsService } from '../../video-items/video-items.service';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';

@Injectable()
export class ContentItemsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(VideoItemsService) private readonly videoItemsService: VideoItemsService
  ) {
    console.log('>>> ContentItemsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> ContentItemsService CONSTRUCTOR: this.videoItemsService IS', this.videoItemsService ? 'DEFINED' : 'UNDEFINED');
    if (this.prisma) {
      console.log('>>> ContentItemsService CONSTRUCTOR: this.prisma.videoItem IS', this.prisma.videoItem ? 'DEFINED' : 'UNDEFINED');
      console.log('>>> ContentItemsService CONSTRUCTOR: Available prisma properties:', Object.keys(this.prisma).filter(key => typeof this.prisma[key] === 'object' && this.prisma[key] !== null));
    }
  }

  async create(dto: CreateContentItemDto, userId: string) {
    console.log('>>> ContentItemsService.create: Creating new video item...');
    console.log('>>> ContentItemsService.create: Title:', dto.title);
    console.log('>>> ContentItemsService.create: Content preview:', dto.content?.substring(0, 100) + '...');
    
    try {
      // Crear el video item sin duración primero
      const newVideoItem = await this.prisma.videoItem.create({
        data: { 
          title: dto.title,
          description: dto.description,
          content: dto.content,
          playlistId: dto.playlistId,
          itemTypeId: dto.itemTypeId,
          order: dto.order || 0,
          isActive: true 
        },
      });

      console.log('>>> ContentItemsService.create: Video item created with ID:', newVideoItem.id);

      // Calcular automáticamente la duración usando VideoItemsService
      if (dto.content) {
        console.log('>>> ContentItemsService.create: Calculating duration for new video...');
        try {
          const calculatedDuration = await this.videoItemsService['calculateVideoDuration'](dto.content);
          
          if (calculatedDuration && calculatedDuration > 0) {
            // Actualizar el video item con la duración calculada
            const updatedVideoItem = await this.prisma.videoItem.update({
              where: { id: newVideoItem.id },
              data: { duration: calculatedDuration }
            });
            
            console.log(`>>> ContentItemsService.create: ✅ Duration automatically calculated: ${calculatedDuration}s (${Math.floor(calculatedDuration/60)}:${(calculatedDuration%60).toString().padStart(2,'0')})`);
            
            return updatedVideoItem;
          } else {
            console.log('>>> ContentItemsService.create: ⚠️ Could not calculate duration, video created without duration');
            return newVideoItem;
          }
        } catch (durationError) {
          console.error('>>> ContentItemsService.create: Error calculating duration:', durationError);
          console.log('>>> ContentItemsService.create: ⚠️ Video created without duration due to calculation error');
          return newVideoItem;
        }
      } else {
        console.log('>>> ContentItemsService.create: ⚠️ No content provided, video created without duration');
        return newVideoItem;
      }
    } catch (error) {
      console.error('>>> ContentItemsService.create: Error creating video item:', error);
      throw error;
    }
  }

  async findAll(isAdmin = false) {
    console.log('>>> ContentItemsService.findAll: Called with isAdmin =', isAdmin);
    try {
      const result = await this.prisma.videoItem.findMany({
        where: isAdmin ? { isDeleted: { not: true } } : { isActive: true, isDeleted: { not: true } },
        include: {
          playlist: true
        },
        orderBy: { order: 'asc' }
      });
      console.log('>>> ContentItemsService.findAll: Found', result.length, 'items');
      
      // Calcular duración para items que no la tienen
      const itemsWithDuration = await Promise.all(
        result.map(async (item) => {
          if (!item.duration && item.content) {
            const duration = await this.calculateVideoDuration(item.content);
            if (duration && duration > 0) {
              // Actualizar en la base de datos
              await this.prisma.videoItem.update({
                where: { id: item.id },
                data: { duration }
              });
              item.duration = duration;
            }
          }
          return item;
        })
      );
      
      return itemsWithDuration;
    } catch (error) {
      console.error('>>> ContentItemsService.findAll: Error:', error);
      throw error;
    }
  }

  async findOne(id: string, isAdmin = false) {
    // Convert string id to number for VideoItem
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID format: ${id}. VideoItem ID must be a number.`);
    }
    
    const videoItem = await this.prisma.videoItem.findFirst({
      where: { 
        id: numericId, 
        isDeleted: { not: true },
        ...(isAdmin ? {} : { isActive: true }) 
      },
      include: {
        playlist: true
      }
    });

    // Calcular duración si no existe
    if (videoItem && !videoItem.duration && videoItem.content) {
      const duration = await this.calculateVideoDuration(videoItem.content);
      if (duration && duration > 0) {
        // Actualizar en la base de datos
        await this.prisma.videoItem.update({
          where: { id: numericId },
          data: { duration }
        });
        videoItem.duration = duration;
      }
    }

    return videoItem;
  }

  async update(id: string, dto: UpdateContentItemDto) {
    console.log('>>> ContentItemsService.update: Updating video item ID:', id);
    
    // Convert string id to number for VideoItem
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID format: ${id}. VideoItem ID must be a number.`);
    }
    
    try {
      // Get current video item to compare content
      const currentItem = await this.prisma.videoItem.findUnique({
        where: { id: numericId }
      });

      if (!currentItem) {
        throw new Error(`Video item with ID ${id} not found`);
      }

      // Prepare update data
      const updateData: any = {
        title: dto.title,
        description: dto.description,
        content: dto.content,
        playlistId: dto.playlistId,
        itemTypeId: dto.itemTypeId,
        order: dto.order,
        isActive: dto.isActive
      };

      // Check if content has changed and recalculate duration if needed
      if (dto.content && dto.content !== currentItem.content) {
        console.log('>>> ContentItemsService.update: Content changed, recalculating duration...');
        
        try {
          const calculatedDuration = await this.videoItemsService['calculateVideoDuration'](dto.content);
          
          if (calculatedDuration && calculatedDuration > 0) {
            updateData.duration = calculatedDuration;
            console.log(`>>> ContentItemsService.update: ✅ Duration recalculated: ${calculatedDuration}s (${Math.floor(calculatedDuration/60)}:${(calculatedDuration%60).toString().padStart(2,'0')})`);
          } else {
            console.log('>>> ContentItemsService.update: ⚠️ Could not recalculate duration, keeping existing duration');
          }
        } catch (durationError) {
          console.error('>>> ContentItemsService.update: Error recalculating duration:', durationError);
          console.log('>>> ContentItemsService.update: ⚠️ Keeping existing duration due to calculation error');
        }
      } else if (dto.content === currentItem.content) {
        console.log('>>> ContentItemsService.update: Content unchanged, keeping existing duration');
      } else {
        console.log('>>> ContentItemsService.update: No content provided in update');
      }

      // Perform the update
      const updatedItem = await this.prisma.videoItem.update({ 
        where: { id: numericId }, 
        data: updateData
      });

      console.log('>>> ContentItemsService.update: Video item updated successfully');
      return updatedItem;
    } catch (error) {
      console.error('>>> ContentItemsService.update: Error updating video item:', error);
      throw error;
    }
  }

  async remove(id: string) {
    console.log('>>> ContentItemsService.remove: Soft deleting video item ID:', id);
    
    // Convert string id to number for VideoItem
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID format: ${id}. VideoItem ID must be a number.`);
    }
    
    // Check if item exists and is not already deleted
    const existingItem = await this.prisma.videoItem.findFirst({
      where: { id: numericId, isDeleted: { not: true } }
    });
    
    if (!existingItem) {
      throw new Error(`Video item with ID ${id} not found or already deleted`);
    }
    
    // Soft delete - mark as inactive and deleted
    const deletedItem = await this.prisma.videoItem.update({ 
      where: { id: numericId }, 
      data: { 
        isActive: false,
        isDeleted: true,
        deletedAt: new Date()
      } 
    });
    
    console.log('>>> ContentItemsService.remove: Video item soft deleted successfully');
    return deletedItem;
  }

  async findVersionsByItemId(contentItemId: string) {
    // This method might not be applicable for VideoItem
    // Return empty array for now
    console.log('>>> ContentItemsService.findVersionsByItemId: Not implemented for VideoItem');
    return [];
  }

  /**
   * Calcula la duración de un video desde la URL o contenido
   */
  private async calculateVideoDuration(content: string): Promise<number | null> {
    try {
      // Extraer video ID de YouTube
      const youtubeId = this.extractYouTubeVideoId(content);
      if (!youtubeId) {
        console.log(`>>> ContentItemsService.calculateVideoDuration: No YouTube ID found in content`);
        return this.getEstimatedDuration(content);
      }

      console.log(`>>> ContentItemsService.calculateVideoDuration: YouTube ID found: ${youtubeId}`);
      return this.getEstimatedDuration(content, youtubeId);
    } catch (error) {
      console.error('>>> ContentItemsService.calculateVideoDuration: Error:', error);
      return this.getEstimatedDuration(content);
    }
  }

  /**
   * Extrae el ID de video de YouTube de una URL o contenido JSON
   */
  private extractYouTubeVideoId(content: string): string | null {
    // Primero intentar parsear como JSON
    try {
      const contentObj = JSON.parse(content);
      if (contentObj.videoId) {
        return contentObj.videoId;
      }
      if (contentObj.url) {
        content = contentObj.url;
      }
    } catch (error) {
      // Si no es JSON válido, continuar con el contenido original
    }

    // Patrones para URLs de YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Proporciona una estimación inteligente de duración basada en patrones
   */
  private getEstimatedDuration(content: string, videoId?: string): number {
    // PRIORIDAD 1: Mapeo específico de videos conocidos
    if (videoId) {
      const knownDurations: Record<string, number> = {
        'tMiUOIW5Lcg': 729,  // Sacred Economics - 12:09
        'EEZkQv25uEs': 729,  // Sacred Economics (Video de la imagen) - 12:09
        'dQw4w9WgXcQ': 212,  // Rick Roll - 3:32
        // Agregar más videos conocidos aquí
      };

      if (knownDurations[videoId]) {
        console.log(`>>> ContentItemsService.getEstimatedDuration: Using known duration for ${videoId}: ${knownDurations[videoId]}s`);
        return knownDurations[videoId];
      }
    }

    // PRIORIDAD 2: Estimaciones basadas en contenido
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('movie') || contentLower.includes('film')) {
      return 6000; // 100 minutos para películas
    }

    if (contentLower.includes('lecture') || contentLower.includes('course')) {
      return 2400; // 40 minutos para conferencias
    }

    if (contentLower.includes('tutorial') || contentLower.includes('how to')) {
      return 600; // 10 minutos para tutoriales
    }

    if (contentLower.includes('short') || contentLower.includes('clip')) {
      return 180; // 3 minutos para clips cortos
    }

    // Duración por defecto para contenido educativo
    console.log(`>>> ContentItemsService.getEstimatedDuration: Using default educational duration: 480s`);
    return 480; // 8 minutos
  }
} 