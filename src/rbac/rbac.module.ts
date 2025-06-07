import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [RolesModule, PermissionsModule],
  providers: [
    Reflector,
    RolesGuard,
    PermissionsGuard
  ],
  exports: [
    Reflector,
    RolesGuard,
    PermissionsGuard,
    RolesModule,
    PermissionsModule
  ],
})
export class RbacModule {} 