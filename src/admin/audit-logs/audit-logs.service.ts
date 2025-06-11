import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';
import { Log, Prisma } from '../../generated/prisma';

// Types for oldValue and newValue in AuditLog
// These fields store snapshots of data before and after an action.
// Their structure is dynamic and depends on the audited entity and action.
export type AuditLogValue = any; // Use 'any' or a more flexible type as structure varies

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: any): Promise<Log> {
    // Adapt audit log data to Log model structure
    const logData: Prisma.LogCreateInput = {
      level: 'INFO',
      message: `${data.actionType || 'ACTION'}: ${data.entityType || 'ENTITY'} ${data.entityId || 'UNKNOWN'}`,
      context: data.entityType || 'AUDIT',
      metadata: JSON.stringify({
        userId: data.userId,
        actionType: data.actionType,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValue: data.oldValue,
        newValue: data.newValue,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      }),
    };
    
    return this.prisma.log.create({
      data: logData,
    });
  }

  async findAll(filterDto: GetAuditLogsDto): Promise<Log[]> {
    const { userId, actionType, startDate, endDate, limit, offset } = filterDto;

    const where: Prisma.LogWhereInput = {};

    // Filter by context to get audit logs
    where.context = 'AUDIT';

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    const logs = await this.prisma.log.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { timestamp: 'desc' }, // Order by latest logs first
    });

    // Filter by userId and actionType from metadata if provided
    if (userId || actionType) {
      return logs.filter(log => {
        if (!log.metadata) return false;
        try {
          const metadata = JSON.parse(log.metadata);
          if (userId && metadata.userId !== userId) return false;
          if (actionType && metadata.actionType !== actionType) return false;
          return true;
        } catch {
          return false;
        }
      });
    }

    return logs;
  }

  async findOne(id: string): Promise<Log | null> {
    const log = await this.prisma.log.findUnique({
      where: { id },
    });
    if (!log) {
        throw new NotFoundException(`Audit log with ID ${id} not found`);
    }
    // oldValue and newValue are JsonValue, compatible with any.
    return log;
  }
} 