import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';
import { Log, Prisma } from '../../generated/prisma';

// Simple audit log interface that maps to the Log model
export interface CreateAuditLogDto {
  userId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: CreateAuditLogDto): Promise<Log> {
    // Map audit log data to the Log model structure
    const logMessage = `${data.actionType} on ${data.entityType} (${data.entityId}) by user ${data.userId}`;
    const metadata = JSON.stringify({
      userId: data.userId,
      actionType: data.actionType,
      entityType: data.entityType,
      entityId: data.entityId,
      oldValue: data.oldValue,
      newValue: data.newValue,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    return this.prisma.log.create({
      data: {
        level: 'info',
        message: logMessage,
        context: 'audit',
        metadata: metadata,
      },
    });
  }

  async findAll(filterDto: GetAuditLogsDto): Promise<Log[]> {
    const { userId, actionType, startDate, endDate, limit, offset } = filterDto;

    const where: Prisma.LogWhereInput = {
      context: 'audit', // Only get audit logs
    };

    // For filtering by userId or actionType, we need to search in metadata
    if (userId || actionType) {
      const metadataFilters: string[] = [];
      if (userId) {
        metadataFilters.push(`"userId":"${userId}"`);
      }
      if (actionType) {
        metadataFilters.push(`"actionType":"${actionType}"`);
      }

      if (metadataFilters.length > 0) {
        where.metadata = {
          contains: metadataFilters.join(' AND '),
        };
      }
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    return this.prisma.log.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { timestamp: 'desc' },
    });
  }

  async findOne(id: string): Promise<Log | null> {
    const log = await this.prisma.log.findUnique({
      where: { id },
    });
    if (!log) {
        throw new NotFoundException(`Audit log with ID ${id} not found`);
    }
    return log;
  }
}
