import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service.js.js';
import { ConfigController } from './config/config.controller.js.js';
import { AuditLogsService } from './audit-logs/audit-logs.service.js.js';
import { AuditLogsController } from './audit-logs/audit-logs.controller.js.js';
import { SystemService } from './system/system.service.js.js';
import { SystemController } from './system/system.controller.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { AuthModule } from '../auth/auth.module.js.js'; // Assuming AuthModule is needed for JwtAuthGuard
import { RbacModule } from '@/rbac/rbac.module'; // Assuming RbacModule is needed for RolesGuard

@Module({
  imports: [PrismaModule, AuthModule, RbacModule], // Import necessary modules
  controllers: [ConfigController, AuditLogsController, SystemController],
  providers: [ConfigService, AuditLogsService, SystemService],
  exports: [ConfigService, AuditLogsService], // Export services that might be used by other modules (e.g., AuditLogsService)
})
export class AdminModule {}
