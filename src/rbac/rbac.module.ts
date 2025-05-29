import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [RolesModule, PermissionsModule],
  providers: [RolesGuard, PermissionsGuard],
  exports: [RolesGuard, PermissionsGuard, RolesModule, PermissionsModule],
})
export class RbacModule {} 