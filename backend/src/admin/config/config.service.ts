import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Configuration } from '../../generated/prisma';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuthenticatedUser } from '../../types/auth.types';

@Injectable()
export class ConfigService {
  constructor(
    private prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(createConfigDto: CreateConfigDto, user: AuthenticatedUser): Promise<Configuration> {
    const newConfig = await this.prisma.configuration.create({
      data: {
        key: createConfigDto.key,
        value: typeof createConfigDto.value === 'string' ? createConfigDto.value : JSON.stringify(createConfigDto.value),
        type: createConfigDto.type || 'string',
      },
    });

    // Log config creation
    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'config:created',
        entityType: 'Configuration',
        entityId: newConfig.id,
        newValue: newConfig,
    });

    return newConfig;
  }

  async findAll(): Promise<Configuration[]> {
    return this.prisma.configuration.findMany();
  }

  async findOne(id: string): Promise<Configuration | null> {
    const config = await this.prisma.configuration.findUnique({
      where: { id },
    });
    if (!config) {
      throw new NotFoundException(`Config with ID ${id} not found`);
    }
    return config;
  }

  async findOneByKey(key: string): Promise<Configuration | null> {
    const config = await this.prisma.configuration.findUnique({
      where: { key },
    });
    return config;
  }

  async update(id: string, updateConfigDto: UpdateConfigDto, user: AuthenticatedUser): Promise<Configuration> {
    const existingConfig = await this.prisma.configuration.findUnique({
        where: { id }
    });

    if (!existingConfig) {
        throw new NotFoundException(`Config with ID ${id} not found`);
    }

    // Capture old value before update
    const oldValue = { ...existingConfig };

    const updatedConfig = await this.prisma.configuration.update({
      where: { id },
      data: {
        ...(updateConfigDto.key && { key: updateConfigDto.key }),
        ...(updateConfigDto.value !== undefined && {
          value: typeof updateConfigDto.value === 'string' ? updateConfigDto.value : JSON.stringify(updateConfigDto.value)
        }),
        ...(updateConfigDto.type && { type: updateConfigDto.type }),
      },
    });

    // Capture new value after update
    const newValue = { ...updatedConfig };

    // Log config update
    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'config:updated',
        entityType: 'Configuration',
        entityId: updatedConfig.id,
        oldValue: oldValue,
        newValue: newValue,
    });

    return updatedConfig;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<Configuration> {
     const existingConfig = await this.prisma.configuration.findUnique({
        where: { id }
    });

    if (!existingConfig) {
        throw new NotFoundException(`Config with ID ${id} not found`);
    }

    // Capture old value before deletion
    const oldValue = { ...existingConfig };

    const deletedConfig = await this.prisma.configuration.delete({
      where: { id },
    });

    // Log config deletion
    await this.auditLogsService.createLog({
        userId: user.id,
        actionType: 'config:deleted',
        entityType: 'Configuration',
        entityId: deletedConfig.id,
        oldValue: oldValue,
    });

    return deletedConfig;
  }
}
