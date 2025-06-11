import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConfigDto, AppConfigValue } from './dto/create-config.dto';
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
    // TODO: Associate createdBy user ID from req.user
    const newConfig = await this.prisma.configuration.create({
      data: {
        ...createConfigDto,
        value: createConfigDto.value ?? {},
        // createdBy: userId, // Uncomment and pass userId from controller
      },
    });

    // Log config creation
    await this.auditLogsService.createLog({
        userId: user.id, // User performing the action
        actionType: 'config:created',
        entityType: 'AppConfig',
        entityId: newConfig.id,
        newValue: newConfig,
        // TODO: Add ipAddress, userAgent if available from request context
    });

    return newConfig;
  }

  async findAll(): Promise<Configuration[]> {
    // TODO: Consider masking sensitive values for non-admin users
    return this.prisma.configuration.findMany();
  }

  async findOne(id: string): Promise<Configuration | null> {
    const config = await this.prisma.configuration.findUnique({
      where: { id },
    });
    if (!config) {
      throw new NotFoundException(`Config with ID ${id} not found`);
    }
     // TODO: Consider masking sensitive values for non-admin users
    return config;
  }

  async findOneByKey(key: string): Promise<Configuration | null> {
    const config = await this.prisma.configuration.findUnique({
      where: { key },
    });
     // TODO: Consider masking sensitive values for non-admin users
    return config; // Can return null if not found, controller handles 404
  }

  async update(id: string, updateConfigDto: UpdateConfigDto, user: AuthenticatedUser): Promise<Configuration> {
     // TODO: Associate updatedBy user ID from req.user
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
        ...updateConfigDto,
        value: updateConfigDto.value ?? existingConfig.value,
        // updatedBy: userId, // Uncomment and pass userId from controller
      },
    });

    // Capture new value after update
    const newValue = { ...updatedConfig };

    // Log config update
    await this.auditLogsService.createLog({
        userId: user.id, // User performing the action
        actionType: 'config:updated',
        entityType: 'AppConfig',
        entityId: updatedConfig.id,
        oldValue: oldValue,
        newValue: newValue,
        // TODO: Add ipAddress, userAgent if available from request context
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
        userId: user.id, // User performing the action
        actionType: 'config:deleted',
        entityType: 'AppConfig',
        entityId: deletedConfig.id,
        oldValue: oldValue, // Show the state before deletion
        // TODO: Add ipAddress, userAgent if available from request context
    });

    return deletedConfig;
  }
} 