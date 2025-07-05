import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service.js.js';
import { AuditLogsController } from './audit-logs.controller.js.js';
import { PrismaModule } from '../../prisma/prisma.module.js.js';

@Module({
  imports: [PrismaModule],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
