import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js.js';
import { CreatePersonalityDto } from './dto/create-personality.dto.js.js';
import { UpdatePersonalityDto } from './dto/update-personality.dto.js.js';
import { AssignPersonalityDto } from './dto/assign-personality.dto.js.js';
import type { Personality } from '../generated/prisma.js.js.js';

@Injectable()
export class PersonalityService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // //     console.log('>>> PersonalityService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async create(
    createPersonalityDto: CreatePersonalityDto
  ): Promise<Personality> {
    try {
      // Verificar si ya existe una personalidad con ese nombre
      const existingPersonality = await this.prisma.personality.findUnique({
        where: { name: createPersonalityDto.name },
      });

      if (existingPersonality) {
        throw new ConflictException(
          `Personality with name "${createPersonalityDto.name}" already exists`
        );
      }

      return await this.prisma.personality.create({
        data: {
          name: createPersonalityDto.name,
          description: createPersonalityDto.description,
          traits: JSON.stringify(createPersonalityDto.traits),
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create personality: ${error.message}`);
    }
  }

  async findAll(): Promise<Personality[]> {
    return await this.prisma.personality.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Personality> {
    const personality = await this.prisma.personality.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!personality) {
      throw new NotFoundException(`Personality with ID "${id}" not found`);
    }

    return personality;
  }

  async update(
    id: string,
    updatePersonalityDto: UpdatePersonalityDto
  ): Promise<Personality> {
    // Verificar que la personalidad existe
    await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otra personalidad con ese nombre
    if (updatePersonalityDto.name) {
      const existingPersonality = await this.prisma.personality.findUnique({
        where: { name: updatePersonalityDto.name },
      });

      if (existingPersonality && existingPersonality.id !== id) {
        throw new ConflictException(
          `Personality with name "${updatePersonalityDto.name}" already exists`
        );
      }
    }

    try {
      return await this.prisma.personality.update({
        where: { id },
        data: {
          ...(updatePersonalityDto.name && { name: updatePersonalityDto.name }),
          ...(updatePersonalityDto.description !== undefined && {
            description: updatePersonalityDto.description,
          }),
          ...(updatePersonalityDto.traits && {
            traits: JSON.stringify(updatePersonalityDto.traits),
          }),
        },
      });
    } catch (error) {
      throw new Error(`Failed to update personality: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    // Verificar que la personalidad existe
    await this.findOne(id);

    try {
      // Verificar si hay usuarios asignados a esta personalidad
      const usersWithPersonality = await this.prisma.user.count({
        where: { personalityId: id },
      });

      if (usersWithPersonality > 0) {
        throw new ConflictException(
          `Cannot delete personality: ${usersWithPersonality} users are assigned to this personality`
        );
      }

      await this.prisma.personality.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to delete personality: ${error.message}`);
    }
  }

  async assignToUser(
    assignPersonalityDto: AssignPersonalityDto
  ): Promise<void> {
    const { userId, personalityId } = assignPersonalityDto;

    // Verificar que la personalidad existe
    await this.findOne(personalityId);

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { personalityId },
      });
    } catch (error) {
      throw new Error(`Failed to assign personality to user: ${error.message}`);
    }
  }

  async removeFromUser(userId: string): Promise<void> {
    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { personalityId: null },
      });
    } catch (error) {
      throw new Error(
        `Failed to remove personality from user: ${error.message}`
      );
    }
  }

  async getUsersByPersonality(personalityId: string) {
    // Verificar que la personalidad existe
    await this.findOne(personalityId);

    return await this.prisma.user.findMany({
      where: { personalityId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async getPersonalityStats() {
    const totalPersonalities = await this.prisma.personality.count();

    const personalitiesWithUserCount = await this.prisma.personality.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    const totalUsersWithPersonality = await this.prisma.user.count({
      where: {
        personalityId: {
          not: null,
        },
      },
    });

    return {
      totalPersonalities,
      totalUsersWithPersonality,
      personalitiesWithUserCount,
    };
  }
}
