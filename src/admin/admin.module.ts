import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { ConfigController } from './config/config.controller';
import { AuditLogsService } from './audit-logs/audit-logs.service';
import { AuditLogsController } from './audit-logs/audit-logs.controller';
import { SystemService } from './system/system.service';
import { SystemController } from './system/system.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';
// import { AuthModule } from '../auth/auth.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard
// import { RbacModule } from '../rbac/rbac.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard

@Module({
  imports: [PrismaModule, AuthModule, RbacModule],
  controllers: [ConfigController, AuditLogsController, SystemController],
  providers: [ConfigService, AuditLogsService, SystemService],
  exports: [ConfigService, AuditLogsService], // Export services that might be used by other modules (e.g., AuditLogsService)
})
export class AdminModule {
  constructor() {
    console.log('>>> AdminModule CONSTRUCTOR: Initializing admin system (with Auth/RBAC).');
  }
} 