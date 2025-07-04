import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorldDto } from './dto/create-world.dto';
import { UpdateWorldDto } from './dto/update-world.dto';
import type { World } from '../../generated/prisma';

@Injectable()
export class WorldsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> WorldsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async create(createWorldDto: CreateWorldDto): Promise<World> {
    try {
      // Validar que el creador existe
      const creator = await this.prisma.user.findUnique({
        where: { id: createWorldDto.creatorId }
      });

      if (!creator) {
        throw new NotFoundException(`Creator with ID ${createWorldDto.creatorId} not found`);
      }

      // Validar tipos de mundo válidos
      const validWorldTypes = ['TRANSITORIO', 'MEDIANA_DURACION'];
      if (!validWorldTypes.includes(createWorldDto.type)) {
        throw new BadRequestException(`Invalid world type: ${createWorldDto.type}`);
      }

      // Validar nombres de mundo válidos
      const validWorldNames = ['ONE', 'DUO', 'TRIKETA', 'ECOVILLAS'];
      if (!validWorldNames.includes(createWorldDto.name)) {
        throw new BadRequestException(`Invalid world name: ${createWorldDto.name}`);
      }

      // Si se especifica mundoId, validar que existe
      if (createWorldDto.mundoId) {
        const mundo = await this.prisma.mundo.findUnique({
          where: { id: createWorldDto.mundoId }
        });

        if (!mundo) {
          throw new NotFoundException(`Mundo with ID ${createWorldDto.mundoId} not found`);
        }
      }

      const world = await this.prisma.world.create({
        data: {
          name: createWorldDto.name,
          description: createWorldDto.description,
          type: createWorldDto.type,
          creatorId: createWorldDto.creatorId,
          status: createWorldDto.status || 'ACTIVE',
          mundoId: createWorldDto.mundoId,
        },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          mundo: true,
          stages: true,
        }
      });

      console.log(`>>> WorldsService: Created world ${world.id} by user ${createWorldDto.creatorId}`);
      return world;
    } catch (error) {
      console.error('>>> WorldsService create error:', error);
      throw error;
    }
  }

  async findAll(): Promise<World[]> {
    try {
      return await this.prisma.world.findMany({
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          mundo: true,
          stages: {
            include: {
              experiences: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('>>> WorldsService findAll error:', error);
      throw error;
    }
  }

  async findByCreatorId(creatorId: string): Promise<World[]> {
    try {
      return await this.prisma.world.findMany({
        where: { creatorId },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          mundo: true,
          stages: {
            include: {
              experiences: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('>>> WorldsService findByCreatorId error:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<World> {
    try {
      const world = await this.prisma.world.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          mundo: true,
          stages: {
            include: {
              experiences: {
                include: {
                  activities: true,
                }
              },
            },
            orderBy: {
              order: 'asc'
            }
          },
        }
      });

      if (!world) {
        throw new NotFoundException(`World with ID ${id} not found`);
      }

      return world;
    } catch (error) {
      console.error('>>> WorldsService findOne error:', error);
      throw error;
    }
  }

  async update(id: string, updateWorldDto: UpdateWorldDto): Promise<World> {
    try {
      // Verificar que el mundo existe
      await this.findOne(id);

      // Validaciones similares a create si se están actualizando esos campos
      if (updateWorldDto.type) {
        const validWorldTypes = ['TRANSITORIO', 'MEDIANA_DURACION'];
        if (!validWorldTypes.includes(updateWorldDto.type)) {
          throw new BadRequestException(`Invalid world type: ${updateWorldDto.type}`);
        }
      }

      if (updateWorldDto.name) {
        const validWorldNames = ['ONE', 'DUO', 'TRIKETA', 'ECOVILLAS'];
        if (!validWorldNames.includes(updateWorldDto.name)) {
          throw new BadRequestException(`Invalid world name: ${updateWorldDto.name}`);
        }
      }

      const world = await this.prisma.world.update({
        where: { id },
        data: updateWorldDto,
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          mundo: true,
          stages: true,
        }
      });

      console.log(`>>> WorldsService: Updated world ${id}`);
      return world;
    } catch (error) {
      console.error('>>> WorldsService update error:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<World> {
    try {
      // Verificar que el mundo existe
      await this.findOne(id);

      const world = await this.prisma.world.delete({
        where: { id },
      });

      console.log(`>>> WorldsService: Deleted world ${id}`);
      return world;
    } catch (error) {
      console.error('>>> WorldsService remove error:', error);
      throw error;
    }
  }

  // Métodos específicos de negocio para worlds

  async getWorldsByStatus(status: string): Promise<World[]> {
    try {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'UNDER_CONSTRUCTION'];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException(`Invalid world status: ${status}`);
      }

      return await this.prisma.world.findMany({
        where: { status },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          mundo: true,
          stages: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('>>> WorldsService getWorldsByStatus error:', error);
      throw error;
    }
  }

  async getWorldsByType(type: string): Promise<World[]> {
    try {
      const validTypes = ['TRANSITORIO', 'MEDIANA_DURACION'];
      if (!validTypes.includes(type)) {
        throw new BadRequestException(`Invalid world type: ${type}`);
      }

      return await this.prisma.world.findMany({
        where: { type },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          mundo: true,
          stages: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('>>> WorldsService getWorldsByType error:', error);
      throw error;
    }
  }
} 