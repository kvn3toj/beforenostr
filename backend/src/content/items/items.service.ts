import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';
import { ContentItem } from '../../generated/prisma';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContentItemDto): Promise<ContentItem> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: dto.playlistId },
    });
    if (!playlist) {
      throw new NotFoundException(
        `Playlist with ID ${dto.playlistId} not found.`
      );
    }

    const itemType = await this.prisma.itemType.findUnique({
      where: { id: dto.itemTypeId },
    });
    if (!itemType) {
      throw new NotFoundException(
        `ItemType with ID ${dto.itemTypeId} not found.`
      );
    }

    return this.prisma.contentItem.create({ data: dto });
  }

  async findAllByPlaylist(playlistId: string): Promise<ContentItem[]> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId, isActive: true },
    });
    if (!playlist) {
      throw new NotFoundException(
        `Playlist with ID ${playlistId} not found or is inactive.`
      );
    }

    return this.prisma.contentItem.findMany({
      where: {
        playlistId,
        isActive: true,
        isDeleted: false,
      },
      orderBy: { order: 'asc' },
    });
  }

  async findAllInPlaylist(
    playlistId: string,
    includeInactive = false
  ): Promise<ContentItem[]> {
    // Ensure the playlist exists and is active for admin view
    const playlist = await this.prisma.playlist.findFirst({
      where: { id: playlistId, isActive: true },
    });
    if (!playlist) {
      throw new NotFoundException(
        `Playlist with ID ${playlistId} not found or is deleted`
      );
    }
    const whereCondition = includeInactive
      ? { playlistId, isDeleted: false }
      : { playlistId, isActive: true, isDeleted: false };
    return this.prisma.contentItem.findMany({
      where: whereCondition,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string, playlistId: string): Promise<ContentItem> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found.`);
    }

    const contentItem = await this.prisma.contentItem.findFirst({
      where: { id, playlistId, isDeleted: false },
    });
    if (!contentItem) {
      throw new NotFoundException(
        `ContentItem with ID ${id} not found in this playlist or is deleted`
      );
    }
    return contentItem;
  }

  async update(id: string, dto: UpdateContentItemDto): Promise<ContentItem> {
    if (dto.playlistId) {
      const playlist = await this.prisma.playlist.findUnique({
        where: { id: dto.playlistId },
      });
      if (!playlist) {
        throw new NotFoundException(
          `Playlist with ID ${dto.playlistId} not found.`
        );
      }
    }

    return this.prisma.contentItem.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<ContentItem> {
    return this.prisma.contentItem.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  // Potentially add methods for versioning/scheduling here later
}
