import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';
import { ContentItem } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContentItemDto): Promise<ContentItem> {
    // Ensure the playlist and item type exist before creating the content item
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: dto.playlistId, isDeleted: false },
    });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${dto.playlistId} not found or is deleted`);
    }
    const itemType = await this.prisma.itemType.findUnique({
        where: { id: dto.itemTypeId, isDeleted: false }
    });
    if (!itemType) {
         throw new NotFoundException(`Item Type with ID ${dto.itemTypeId} not found or is deleted`);
    }

    return this.prisma.contentItem.create({
      data: { ...dto, isActive: dto.isActive ?? true },
    });
  }

  async findAllActiveInPlaylist(playlistId: string): Promise<ContentItem[]> {
    // Ensure the playlist is active and not deleted
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId, isActive: true, isDeleted: false },
    });
    if (!playlist) {
      throw new NotFoundException(`Active playlist with ID ${playlistId} not found`);
    }
    return this.prisma.contentItem.findMany({
      where: { playlistId, isActive: true, isDeleted: false },
      orderBy: { order: 'asc' }, // Assuming 'order' field for ordering
    });
  }

  async findAllInPlaylist(playlistId: string, includeInactive = false): Promise<ContentItem[]> {
    // Ensure the playlist exists and is not deleted for admin view
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId, isDeleted: false },
    });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found or is deleted`);
    }
    const whereCondition = includeInactive
      ? { playlistId, isDeleted: false }
      : { playlistId, isActive: true, isDeleted: false };
    return this.prisma.contentItem.findMany({
      where: whereCondition,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<ContentItem | null> {
    return this.prisma.contentItem.findUnique({ where: { id, isDeleted: false } });
  }

  async update(id: string, dto: UpdateContentItemDto): Promise<ContentItem> {
    const item = await this.prisma.contentItem.findUnique({ where: { id, isDeleted: false } });
    if (!item) {
      throw new NotFoundException(`ContentItem with ID ${id} not found or is deleted`);
    }
     // If playlistId or itemTypeId is being updated, ensure the new ones exist and are not deleted
     if (dto.playlistId) {
        const nuevaPlaylist = await this.prisma.playlist.findUnique({
            where: { id: dto.playlistId, isDeleted: false }
        });
        if (!nuevaPlaylist) {
             throw new NotFoundException(`New playlist with ID ${dto.playlistId} not found or is deleted`);
        }
     }
     if (dto.itemTypeId) {
        const newItemType = await this.prisma.itemType.findUnique({
             where: { id: dto.itemTypeId, isDeleted: false }
        });
        if (!newItemType) {
            throw new NotFoundException(`New Item Type with ID ${dto.itemTypeId} not found or is deleted`);
        }
     }

    return this.prisma.contentItem.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<ContentItem> {
    const item = await this.prisma.contentItem.findUnique({ where: { id, isDeleted: false } });
    if (!item) {
      throw new NotFoundException(`ContentItem with ID ${id} not found or is deleted`);
    }
    // Soft delete
    return this.prisma.contentItem.update({
      where: { id },
      data: { isDeleted: true, isActive: false }, // Mark as inactive on soft delete
    });
  }

  // Potentially add methods for versioning/scheduling here later
} 