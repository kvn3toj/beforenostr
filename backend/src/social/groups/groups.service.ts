import { Injectable, Inject, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import type { Group, UserGroup } from '../../generated/prisma';

@Injectable()
export class GroupsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
// //     console.log('>>> GroupsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    try {
      // Validar que el owner existe
      const owner = await this.prisma.user.findUnique({
        where: { id: createGroupDto.ownerId }
      });

      if (!owner) {
        throw new NotFoundException(`Owner with ID ${createGroupDto.ownerId} not found`);
      }

      // Validar tipos de grupo válidos
      const validGroupTypes = ['CLAN', 'FRIEND', 'CLIENT', 'ALLY', 'GOVERNANCE_BODY', 'COMMUNITY_OF_PRACTICE'];
      if (!validGroupTypes.includes(createGroupDto.type)) {
        throw new BadRequestException(`Invalid group type: ${createGroupDto.type}`);
      }

      const group = await this.prisma.group.create({
        data: {
          name: createGroupDto.name,
          description: createGroupDto.description,
          ownerId: createGroupDto.ownerId,
          type: createGroupDto.type,
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          userGroups: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  username: true,
                }
              }
            }
          },
        }
      });

//       console.log(`>>> GroupsService: Created group ${group.id} by user ${createGroupDto.ownerId}`);
      return group;
    } catch (error) {
//       console.error('>>> GroupsService create error:', error);
      throw error;
    }
  }

  async findAll(): Promise<Group[]> {
    try {
      return await this.prisma.group.findMany({
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          userGroups: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  username: true,
                }
              }
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
//       console.error('>>> GroupsService findAll error:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Group> {
    try {
      const group = await this.prisma.group.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          userGroups: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  username: true,
                }
              }
            }
          },
        }
      });

      if (!group) {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }

      return group;
    } catch (error) {
//       console.error('>>> GroupsService findOne error:', error);
      throw error;
    }
  }

  async joinGroup(joinGroupDto: JoinGroupDto): Promise<UserGroup> {
    try {
      // Validar que el usuario existe
      const user = await this.prisma.user.findUnique({
        where: { id: joinGroupDto.userId }
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${joinGroupDto.userId} not found`);
      }

      // Validar que el grupo existe
      await this.findOne(joinGroupDto.groupId);

      // Verificar que el usuario no esté ya en el grupo
      const existingMembership = await this.prisma.userGroup.findUnique({
        where: {
          userId_groupId: {
            userId: joinGroupDto.userId,
            groupId: joinGroupDto.groupId,
          }
        }
      });

      if (existingMembership) {
        throw new ConflictException(`User ${joinGroupDto.userId} is already a member of group ${joinGroupDto.groupId}`);
      }

      // Validar roles válidos
      const validRoles = ['MEMBER', 'LEADER', 'ARBITRATOR', 'MODERATOR'];
      const roleInGroup = joinGroupDto.roleInGroup || 'MEMBER';
      if (!validRoles.includes(roleInGroup)) {
        throw new BadRequestException(`Invalid role in group: ${roleInGroup}`);
      }

      const userGroup = await this.prisma.userGroup.create({
        data: {
          userId: joinGroupDto.userId,
          groupId: joinGroupDto.groupId,
          roleInGroup,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
            }
          },
          group: {
            include: {
              owner: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  username: true,
                }
              }
            }
          }
        }
      });

//       console.log(`>>> GroupsService: User ${joinGroupDto.userId} joined group ${joinGroupDto.groupId} as ${roleInGroup}`);
      return userGroup;
    } catch (error) {
//       console.error('>>> GroupsService joinGroup error:', error);
      throw error;
    }
  }
} 