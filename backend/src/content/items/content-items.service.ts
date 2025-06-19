import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';

@Injectable()
export class ContentItemsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
// //     console.log('>>> ContentItemsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    if (this.prisma) {
// //       console.log('>>> ContentItemsService CONSTRUCTOR: this.prisma.videoItem IS', this.prisma.videoItem ? 'DEFINED' : 'UNDEFINED');
// //       console.log('>>> ContentItemsService CONSTRUCTOR: Available prisma properties:', Object.keys(this.prisma).filter(key => typeof this.prisma[key] === 'object' && this.prisma[key] !== null));
    }
  }

  async create(dto: CreateContentItemDto, userId: string) {
    return this.prisma.videoItem.create({
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
  }

  async findAll(isAdmin = false) {
//     console.log('>>> ContentItemsService.findAll: Called with isAdmin =', isAdmin);
    try {
      const result = await this.prisma.videoItem.findMany({
        where: isAdmin ? {} : { isActive: true },
        include: {
          playlist: true
        },
        orderBy: { order: 'asc' }
      });
//       console.log('>>> ContentItemsService.findAll: Found', result.length, 'items');
      return result;
    } catch (error) {
//       console.error('>>> ContentItemsService.findAll: Error:', error);
      throw error;
    }
  }

  async findOne(id: string, isAdmin = false) {
    // Convert string id to number for VideoItem
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID format: ${id}. VideoItem ID must be a number.`);
    }
    
    return this.prisma.videoItem.findFirst({
      where: { 
        id: numericId, 
        ...(isAdmin ? {} : { isActive: true }) 
      },
      include: {
        playlist: true
      }
    });
  }

  async update(id: string, dto: UpdateContentItemDto) {
    // Convert string id to number for VideoItem
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID format: ${id}. VideoItem ID must be a number.`);
    }
    
    return this.prisma.videoItem.update({ 
      where: { id: numericId }, 
      data: {
        title: dto.title,
        description: dto.description,
        content: dto.content,
        playlistId: dto.playlistId,
        itemTypeId: dto.itemTypeId,
        order: dto.order,
        isActive: dto.isActive
      }
    });
  }

  async remove(id: string) {
    // Convert string id to number for VideoItem
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID format: ${id}. VideoItem ID must be a number.`);
    }
    
    // Soft delete
    return this.prisma.videoItem.update({ 
      where: { id: numericId }, 
      data: { isActive: false } 
    });
  }

  async findVersionsByItemId(contentItemId: string) {
    // This method might not be applicable for VideoItem
    // Return empty array for now
//     console.log('>>> ContentItemsService.findVersionsByItemId: Not implemented for VideoItem');
    return [];
  }
} 