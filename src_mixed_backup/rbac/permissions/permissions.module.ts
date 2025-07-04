import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditLogsModule } from '../../admin/audit-logs/audit-logs.module';
import { RolesGuard } from '../guards/roles.guard';

@Module({
  imports: [PrismaModule, AuditLogsModule],
  providers: [PermissionsService, RolesGuard],
  controllers: [PermissionsController],
  exports: [PermissionsService],
})
export class PermissionsModule {} 