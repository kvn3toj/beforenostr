import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js.js';
import { NotificationsService } from './notifications.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
// import { AuthModule } from '../auth/auth.module.js.js'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard
// import { RbacModule } from '@/rbac/rbac.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard

@Module({
  imports: [PrismaModule], // Solo PrismaModule por ahora, sin Auth/RBAC
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {
  constructor() {
    // //     console.log('>>> NotificationsModule CONSTRUCTOR: Initializing notifications system (without Auth/RBAC)...');
  }
}
