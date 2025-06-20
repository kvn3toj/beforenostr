import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from '../../generated/prisma';

@Injectable()
export class PlaylistsService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async create(dto: CreatePlaylistDto): Promise<Playlist> {
    // Ensure the mundo exists before creating the playlist
    const mundo = await this.prisma.mundo.findUnique({
      where: { id: dto.mundoId },
    });
    if (!mundo) {
      throw new NotFoundException(`Mundo with ID ${dto.mundoId} not found`);
    }
    return this.prisma.playlist.create({
      data: { ...dto, isActive: dto.isActive ?? true },
    });
  }

  async findAllActiveInMundo(mundoId: string): Promise<Playlist[]> {
    // Ensure the mundo is active
    const mundo = await this.prisma.mundo.findUnique({
      where: { id: mundoId, isActive: true },
    });
    if (!mundo) {
      throw new NotFoundException(`Active mundo with ID ${mundoId} not found`);
    }
    return this.prisma.playlist.findMany({
      where: { mundoId, isActive: true },
    });
  }

  async findAllInMundo(mundoId: string, includeInactive = false): Promise<Playlist[]> {
     // Ensure the mundo exists for admin view
     const mundo = await this.prisma.mundo.findUnique({
       where: { id: mundoId },
     });
     if (!mundo) {
       throw new NotFoundException(`Mundo with ID ${mundoId} not found`);
     }
    const whereCondition = includeInactive
      ? { mundoId }
      : { mundoId, isActive: true };
    return this.prisma.playlist.findMany({ where: whereCondition });
  }

  async findOne(id: string): Promise<Playlist | null> {
    return this.prisma.playlist.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
     // If mundoId is being updated, ensure the new mundo exists
     if (dto.mundoId) {
        const nuevoMundo = await this.prisma.mundo.findUnique({
            where: { id: dto.mundoId }
        });
        if (!nuevoMundo) {
             throw new NotFoundException(`New mundo with ID ${dto.mundoId} not found`);
        }
     }
    return this.prisma.playlist.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<Playlist> {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
    // Soft delete by marking as inactive
    return this.prisma.playlist.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findItemsByPlaylistId(playlistId: string, isAdmin = false) {
    return this.prisma.videoItem.findMany({
      where: { playlistId, ...(isAdmin ? {} : { isActive: true }) },
    });
  }
} 