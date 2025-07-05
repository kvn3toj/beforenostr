import { Module } from '@nestjs/common';
import { LetsController } from './lets.controller.js.js';
import { LetsService } from './lets.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
// import { AuthModule } from '../auth/auth.module.js.js'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard
// import { RbacModule } from '@/rbac/rbac.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard

@Module({
  imports: [PrismaModule], // Solo PrismaModule por ahora, sin Auth/RBAC
  controllers: [LetsController],
  providers: [LetsService],
  exports: [LetsService],
})
export class LetsModule {
  constructor() {
    // //     console.log('>>> LetsModule CONSTRUCTOR: Initializing LETS (Local Exchange Trading System) (without Auth/RBAC)...');
  }
}
