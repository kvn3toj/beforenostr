import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller.js.js';
import { InvitationsService } from './invitations.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
// import { AuthModule } from '../auth/auth.module.js.js'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard
// import { RbacModule } from '@/rbac/rbac.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard
import { NotificationsModule } from '../notifications/notifications.module.js.js';

@Module({
  imports: [PrismaModule, NotificationsModule], // Solo PrismaModule y NotificationsModule por ahora, sin Auth/RBAC
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {
  constructor() {
    // //     console.log('>>> InvitationsModule CONSTRUCTOR: Initializing invitations system (without Auth/RBAC)...');
  }
}
