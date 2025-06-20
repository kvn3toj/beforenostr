import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import type { Experience } from '../../generated/prisma';

@Injectable()
export class ExperiencesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
// //     console.log('>>> ExperiencesService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    try {
      // Validar que el stage existe
      const stage = await this.prisma.stage.findUnique({
        where: { id: createExperienceDto.stageId }
      });

      if (!stage) {
        throw new NotFoundException(`Stage with ID ${createExperienceDto.stageId} not found`);
      }

      // Validar que el creador existe
      const creator = await this.prisma.user.findUnique({
        where: { id: createExperienceDto.creatorId }
      });

      if (!creator) {
        throw new NotFoundException(`Creator with ID ${createExperienceDto.creatorId} not found`);
      }

      // Validar tipos de experiencia válidos
      const validExperienceTypes = ['GAMIFIED_SOLVER', 'GAMIFIED_CLIENT', 'REFORMATORY'];
      if (!validExperienceTypes.includes(createExperienceDto.type)) {
        throw new BadRequestException(`Invalid experience type: ${createExperienceDto.type}`);
      }

      const experience = await this.prisma.experience.create({
        data: {
          stageId: createExperienceDto.stageId,
          title: createExperienceDto.title,
          description: createExperienceDto.description,
          type: createExperienceDto.type,
          gamificationFramework: createExperienceDto.gamificationFramework || 'Octalysis',
          creatorId: createExperienceDto.creatorId,
        },
        include: {
          stage: {
            include: {
              world: true,
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          activities: true,
        }
      });

//       console.log(`>>> ExperiencesService: Created experience ${experience.id} by user ${createExperienceDto.creatorId}`);
      return experience;
    } catch (error) {
//       console.error('>>> ExperiencesService create error:', error);
      throw error;
    }
  }

  async findAll(): Promise<Experience[]> {
    try {
      return await this.prisma.experience.findMany({
        include: {
          stage: {
            include: {
              world: true,
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          activities: {
            include: {
              questions: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
//       console.error('>>> ExperiencesService findAll error:', error);
      throw error;
    }
  }

  async findByStageId(stageId: string): Promise<Experience[]> {
    try {
      return await this.prisma.experience.findMany({
        where: { stageId },
        include: {
          stage: {
            include: {
              world: true,
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          activities: {
            include: {
              questions: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
//       console.error('>>> ExperiencesService findByStageId error:', error);
      throw error;
    }
  }

  async findByCreatorId(creatorId: string): Promise<Experience[]> {
    try {
      return await this.prisma.experience.findMany({
        where: { creatorId },
        include: {
          stage: {
            include: {
              world: true,
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          activities: {
            include: {
              questions: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
//       console.error('>>> ExperiencesService findByCreatorId error:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Experience> {
    try {
      const experience = await this.prisma.experience.findUnique({
        where: { id },
        include: {
          stage: {
            include: {
              world: {
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
                }
              },
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          activities: {
            include: {
              questions: true,
              gamifiedPlaylists: true,
            },
            orderBy: {
              order: 'asc'
            }
          },
        }
      });

      if (!experience) {
        throw new NotFoundException(`Experience with ID ${id} not found`);
      }

      return experience;
    } catch (error) {
//       console.error('>>> ExperiencesService findOne error:', error);
      throw error;
    }
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto): Promise<Experience> {
    try {
      // Verificar que la experiencia existe
      await this.findOne(id);

      // Validaciones similares a create si se están actualizando esos campos
      if (updateExperienceDto.type) {
        const validExperienceTypes = ['GAMIFIED_SOLVER', 'GAMIFIED_CLIENT', 'REFORMATORY'];
        if (!validExperienceTypes.includes(updateExperienceDto.type)) {
          throw new BadRequestException(`Invalid experience type: ${updateExperienceDto.type}`);
        }
      }

      if (updateExperienceDto.stageId) {
        const stage = await this.prisma.stage.findUnique({
          where: { id: updateExperienceDto.stageId }
        });

        if (!stage) {
          throw new NotFoundException(`Stage with ID ${updateExperienceDto.stageId} not found`);
        }
      }

      const experience = await this.prisma.experience.update({
        where: { id },
        data: updateExperienceDto,
        include: {
          stage: {
            include: {
              world: true,
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          activities: true,
        }
      });

//       console.log(`>>> ExperiencesService: Updated experience ${id}`);
      return experience;
    } catch (error) {
//       console.error('>>> ExperiencesService update error:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<Experience> {
    try {
      // Verificar que la experiencia existe
      await this.findOne(id);

      const experience = await this.prisma.experience.delete({
        where: { id },
      });

//       console.log(`>>> ExperiencesService: Deleted experience ${id}`);
      return experience;
    } catch (error) {
//       console.error('>>> ExperiencesService remove error:', error);
      throw error;
    }
  }

  // Métodos específicos de negocio para experiences

  async getExperiencesByType(type: string): Promise<Experience[]> {
    try {
      const validTypes = ['GAMIFIED_SOLVER', 'GAMIFIED_CLIENT', 'REFORMATORY'];
      if (!validTypes.includes(type)) {
        throw new BadRequestException(`Invalid experience type: ${type}`);
      }

      return await this.prisma.experience.findMany({
        where: { type },
        include: {
          stage: {
            include: {
              world: true,
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          activities: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
//       console.error('>>> ExperiencesService getExperiencesByType error:', error);
      throw error;
    }
  }

  async getExperiencesByFramework(framework: string): Promise<Experience[]> {
    try {
      return await this.prisma.experience.findMany({
        where: { gamificationFramework: framework },
        include: {
          stage: {
            include: {
              world: true,
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          activities: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
//       console.error('>>> ExperiencesService getExperiencesByFramework error:', error);
      throw error;
    }
  }
} 