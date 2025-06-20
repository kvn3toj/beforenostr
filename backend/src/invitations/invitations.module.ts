import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { PrismaModule } from '../prisma/prisma.module';
// import { AuthModule } from '../auth/auth.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard
// import { RbacModule } from '../rbac/rbac.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard
import { NotificationsModule } from '../notifications/notifications.module';

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