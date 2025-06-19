import { Controller, Get, UseGuards, Req, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

@ApiTags('users-test')
@Controller('users-test')
export class UsersTestController {
  constructor(private reflector: Reflector) {}

  @Get('no-auth')
  async testNoAuth() {
    return { 
      message: 'No auth test working!', 
      timestamp: new Date().toISOString() 
    };
  }

  @Get('auth-only')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async testAuthOnly(@Req() req) {
    return { 
      message: 'Auth only test working!', 
      user: req.user,
      userRoles: req.user?.roles,
      timestamp: new Date().toISOString() 
    };
  }

  @Get('auth-and-roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async testAuthAndRoles(@Req() req) {
    return { 
      message: 'Auth and roles test working!', 
      user: req.user,
      userRoles: req.user?.roles,
      timestamp: new Date().toISOString() 
    };
  }

  @Get('debug-roles')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  async testDebugRoles(@Req() req) {
//     console.log('>>> DEBUG ROLES ENDPOINT: req.user:', req.user);
//     console.log('>>> DEBUG ROLES ENDPOINT: req.user.roles:', req.user?.roles);
//     console.log('>>> DEBUG ROLES ENDPOINT: typeof req.user.roles:', typeof req.user?.roles);
    return { 
      message: 'Debug roles test - only JWT auth, with @Roles decorator!', 
      user: req.user,
      userRoles: req.user?.roles,
      hasAdminRole: req.user?.roles?.includes('admin'),
      timestamp: new Date().toISOString() 
    };
  }

  @Get('method-level-guards')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async testMethodLevelGuards(@Req() req) {
//     console.log('>>> METHOD LEVEL GUARDS ENDPOINT: req.user:', req.user);
    return { 
      message: 'Method level guards test working!', 
      user: req.user,
      userRoles: req.user?.roles,
      timestamp: new Date().toISOString() 
    };
  }

  @Get('manual-guard-test')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  async testManualGuard(@Req() req) {
//     console.log('>>> MANUAL GUARD TEST: Starting...');
    
    // Manually test the guard logic
    const guard = new RolesGuard(this.reflector);
//     console.log('>>> MANUAL GUARD TEST: Guard created:', !!guard);
    
    // Test if we can access the roles metadata
    const requiredRoles = this.reflector.get(Roles, UsersTestController.prototype.testManualGuard);
//     console.log('>>> MANUAL GUARD TEST: Required roles from reflector:', requiredRoles);
    
    return { 
      message: 'Manual guard test!', 
      user: req.user,
      userRoles: req.user?.roles,
      guardExists: !!guard,
      requiredRoles: requiredRoles,
      timestamp: new Date().toISOString() 
    };
  }
} 