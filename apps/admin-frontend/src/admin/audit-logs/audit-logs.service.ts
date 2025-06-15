import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';
import { AuditLog, Prisma } from '@prisma/client';

// Types for oldValue and newValue in AuditLog
// These fields store snapshots of data before and after an action.
// Their structure is dynamic and depends on the audited entity and action.
export type AuditLogValue = any; // Use 'any' or a more flexible type as structure varies

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data,
    });
  }

  async findAll(filterDto: GetAuditLogsDto): Promise<AuditLog[]> {
    const { userId, actionType, startDate, endDate, limit, offset } = filterDto;

    const where: Prisma.AuditLogWhereInput = {};

    if (userId) {
      where.userId = userId;
    }
    if (actionType) {
      where.actionType = actionType;
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

    // oldValue and newValue are JsonValue, compatible with any.
    return this.prisma.auditLog.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { timestamp: 'desc' }, // Order by latest logs first
    });
  }

  async findOne(id: string): Promise<AuditLog | null> {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
    });
    if (!log) {
        throw new NotFoundException(`Audit log with ID ${id} not found`);
    }
    // oldValue and newValue are JsonValue, compatible with any.
    return log;
  }
} 