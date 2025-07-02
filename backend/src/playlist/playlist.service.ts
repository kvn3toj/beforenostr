import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { FindAllPlaylistsDto } from './dto/find-all-playlists.dto';

@Injectable()
export class PlaylistService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(createPlaylistDto: CreatePlaylistDto) {
    const mundo = await this.prisma.mundo.findUnique({
      where: { id: createPlaylistDto.mundoId },
    });

    if (!mundo) {
      throw new NotFoundException(
        `Mundo with ID ${createPlaylistDto.mundoId} not found`
      );
    }

    let orderInMundo = createPlaylistDto.orderInMundo;
    if (orderInMundo === undefined || orderInMundo === null) {
      const lastPlaylist = await this.prisma.playlist.findFirst({
        where: { mundoId: createPlaylistDto.mundoId },
        orderBy: { orderInMundo: 'desc' },
      });
      orderInMundo = (lastPlaylist?.orderInMundo || 0) + 1;
    }

    return this.prisma.playlist.create({
      data: {
        ...createPlaylistDto,
        orderInMundo,
      },
      include: {
        mundo: true,
        videoItems: true,
      },
    });
  }

  async findAll(findAllDto?: FindAllPlaylistsDto) {
    const {
      mundoId,
      name,
      description,
      isActive = true,
      orderBy = 'createdAt',
      orderDirection = 'desc',
      includeItems = false,
      includeMundo = false,
      page = 1,
      limit = 10,
    } = findAllDto || {};

    const skip = (page - 1) * limit;

    const where: any = {};
    if (mundoId) where.mundoId = mundoId;
    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (description)
      where.description = { contains: description, mode: 'insensitive' };

    const include: any = {};
    if (includeMundo) include.mundo = true;
    if (includeItems) {
      include.videoItems = {
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          thumbnailUrl: true,
          duration: true,
          categories: true,
          platform: true,
          externalId: true,
          isActive: true,
          order: true,
          questions: {
            select: {
              id: true,
              text: true,
              timestamp: true,
              type: true,
              answerOptions: {
                select: {
                  id: true,
                  text: true,
                  isCorrect: true,
                  order: true
                }
              }
            }
          }
        },
        where: { isActive: true },
        orderBy: { order: 'asc' },
      };
    }

    const orderByClause: any = {
      [orderBy]: orderDirection,
    };

    const [playlists, totalCount] = await this.prisma.$transaction([
      this.prisma.playlist.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      this.prisma.playlist.count({ where }),
    ]);

    return {
      data: playlists,
      count: totalCount,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        mundo: true,
        videoItems: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
    return playlist;
  }

  async update(id: string, updatePlaylistDto: UpdatePlaylistDto) {
    await this.findOne(id); // Ensure playlist exists
    return this.prisma.playlist.update({
      where: { id },
      data: updatePlaylistDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure playlist exists
    return this.prisma.playlist.delete({ where: { id } });
  }
}
