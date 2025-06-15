import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RolesGuard } from '../guards/roles.guard';
// import { AuditLogsModule } from '../../admin/audit-logs/audit-logs.module'; // Temporarily commented

@Module({
  imports: [PrismaModule], // Only PrismaModule for now
  providers: [RolesService, RolesGuard],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {
  constructor() {
    console.log('>>> RolesModule CONSTRUCTOR: Initializing...');
  }
} 