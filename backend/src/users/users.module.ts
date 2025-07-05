import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js.js';
import { SimpleUsersService } from './users.service.simple.js.js';
import { MinimalUsersService } from './users.service.minimal.js.js';
import { UsersController } from './users.controller.js.js';
import { SimpleUsersController } from './users.controller.simple.js.js';
import { MinimalUsersController } from './users.controller.minimal.js.js';
import { UsersTestController } from './users-test.controller.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { RbacModule } from '@/rbac/rbac.module';
// import { AuthModule } from '../auth/auth.module.js.js'; // Temporarily commented to isolate DI issue
// import { AuditLogsModule } from '../admin/audit-logs/audit-logs.module.js.js'; // Temporarily commented

@Module({
  imports: [PrismaModule, RbacModule], // Added RbacModule for RolesGuard
  controllers: [
    UsersController,
    SimpleUsersController,
    MinimalUsersController,
    UsersTestController,
  ],
  providers: [UsersService, SimpleUsersService, MinimalUsersService],
  exports: [UsersService],
})
export class UsersModule {
  constructor() {
    // // //     console.log('>>> UsersModule CONSTRUCTOR: Initializing...');
  }
}
