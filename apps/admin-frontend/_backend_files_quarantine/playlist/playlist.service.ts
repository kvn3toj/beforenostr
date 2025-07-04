import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { FindAllPlaylistsDto } from './dto/find-all-playlists.dto';

@Injectable()
export class PlaylistService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> PlaylistService CONSTRUCTOR: Initializing...');
    console.log('>>> PlaylistService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  // Minimal implementations to satisfy controller
  async create(createPlaylistDto: CreatePlaylistDto) {
    console.log('>>> PlaylistService.create called with data:', createPlaylistDto);
    console.log('>>> PlaylistService.create - mundoId value:', createPlaylistDto.mundoId);
    console.log('>>> PlaylistService.create - mundoId type:', typeof createPlaylistDto.mundoId);
    
    try {
      // Verificar que el mundo existe
      console.log('>>> PlaylistService.create - About to query mundo with id:', createPlaylistDto.mundoId);
      
      const mundo = await this.prisma.mundo.findUnique({
        where: { id: createPlaylistDto.mundoId }
      });
      
      console.log('>>> PlaylistService.create - Mundo query result:', mundo);
      
      if (!mundo) {
        throw new Error(`Mundo with ID ${createPlaylistDto.mundoId} not found`);
      }
      
      console.log('>>> PlaylistService.create - Mundo found:', mundo.name);
      
      // Obtener el siguiente orderInMundo si no se especifica
      let orderInMundo = createPlaylistDto.orderInMundo;
      if (orderInMundo === undefined || orderInMundo === null) {
        const lastPlaylist = await this.prisma.playlist.findFirst({
          where: { mundoId: createPlaylistDto.mundoId },
          orderBy: { orderInMundo: 'desc' }
        });
        orderInMundo = (lastPlaylist?.orderInMundo || 0) + 1;
      }
      
      console.log('>>> PlaylistService.create - About to create playlist with orderInMundo:', orderInMundo);
      
      // Crear la playlist en la base de datos
      const newPlaylist = await this.prisma.playlist.create({
        data: {
          mundoId: createPlaylistDto.mundoId,
          name: createPlaylistDto.name,
          description: createPlaylistDto.description,
          imageUrl: createPlaylistDto.imageUrl,
          orderInMundo,
          isActive: createPlaylistDto.isActive ?? true,
          // createdById se puede agregar cuando tengamos autenticación
        },
        include: {
          mundo: true,
          videoItems: true
        }
      });
      
      console.log('>>> PlaylistService.create - Playlist created successfully:', newPlaylist.id);
      
      return newPlaylist;
    } catch (error) {
      console.error('>>> PlaylistService.create - Error:', error);
      throw error;
    }
  }

  async findAll(findAllDto?: FindAllPlaylistsDto) {
    console.log('>>> PlaylistService.findAll called with filters:', findAllDto);
    
    try {
      // Establecer valores por defecto
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

      // Calcular skip para paginación
      const skip = (page - 1) * limit;

      // Construir filtros dinámicos
      const where: any = {};

      if (mundoId) {
        where.mundoId = mundoId;
      }

      if (typeof isActive === 'boolean') {
        where.isActive = isActive;
      }

      if (name) {
        where.name = {
          contains: name,
          mode: 'insensitive',
        };
      }

      if (description) {
        where.description = {
          contains: description,
          mode: 'insensitive',
        };
      }

      // Construir include dinámico para relaciones
      const include: any = {};

      if (includeMundo) {
        include.mundo = true;
      }

      if (includeItems) {
        include.videoItems = {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        };
      }

      // Construir orderBy dinámico
      const orderByClause: any = {};
      orderByClause[orderBy] = orderDirection;

      console.log('>>> PlaylistService.findAll - Where clause:', JSON.stringify(where, null, 2));
      console.log('>>> PlaylistService.findAll - Include clause:', JSON.stringify(include, null, 2));
      console.log('>>> PlaylistService.findAll - OrderBy clause:', JSON.stringify(orderByClause, null, 2));

      // Ejecutar consultas en paralelo
      const [playlists, totalCount] = await Promise.all([
        this.prisma.playlist.findMany({
          where,
          include: Object.keys(include).length > 0 ? include : undefined,
          orderBy: orderByClause,
          skip,
          take: limit,
        }),
        this.prisma.playlist.count({
          where,
        }),
      ]);

      console.log('>>> PlaylistService.findAll - Found playlists:', playlists.length);
      console.log('>>> PlaylistService.findAll - Total count:', totalCount);

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
    } catch (error) {
      console.error('>>> PlaylistService.findAll - Error:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    console.log('>>> PlaylistService.findOne called with id:', id);
    return { message: 'FindOne method called', id };
  }

  async update(id: string, updatePlaylistDto: UpdatePlaylistDto) {
    console.log('>>> PlaylistService.update called with id:', id);
    return { message: 'Update method called', id, data: updatePlaylistDto };
  }

  async remove(id: string) {
    console.log('>>> PlaylistService.remove called with id:', id);
    return { message: 'Remove method called', id };
  }
} 