import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SimpleUsersService } from './users.service.simple';
import { MinimalUsersService } from './users.service.minimal';
import { UsersController } from './users.controller';
import { SimpleUsersController } from './users.controller.simple';
import { DebugUsersController } from './users.controller.debug';
import { MinimalUsersController } from './users.controller.minimal';
import { UsersTestController } from './users-test.controller';
import { PrismaModule } from '../prisma/prisma.module';
// import { RbacModule } from '../rbac/rbac.module'; // COMENTADO TEMPORALMENTE - DEPENDENCIA CIRCULAR CON AuthModule
// import { AuthModule } from '../auth/auth.module'; // COMENTADO TEMPORALMENTE - DEPENDENCIA CIRCULAR
// import { AuditLogsModule } from '../admin/audit-logs/audit-logs.module'; // Temporarily commented

@Module({
  imports: [PrismaModule /* RbacModule, AuthModule */], // COMENTADO TEMPORALMENTE - DEPENDENCIA CIRCULAR
  controllers: [UsersController, SimpleUsersController, DebugUsersController, MinimalUsersController, UsersTestController],
  providers: [
    UsersService,
    SimpleUsersService,
    MinimalUsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {
  constructor() {
    console.log('>>> UsersModule CONSTRUCTOR: Initializing (without RBAC to avoid circular dependency)...');
  }
} 