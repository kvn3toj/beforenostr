import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard.js.js';

@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class RbacModule {}
