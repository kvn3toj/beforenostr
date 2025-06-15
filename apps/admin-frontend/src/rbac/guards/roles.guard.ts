import { Injectable, CanActivate, ExecutionContext, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Optional() private reflector?: Reflector) {
    console.log('>>> RolesGuard CONSTRUCTOR: Initializing...');
    console.log('>>> RolesGuard CONSTRUCTOR: reflector IS', this.reflector ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> RolesGuard CONSTRUCTOR: reflector type:', typeof this.reflector);
  }

  canActivate(context: ExecutionContext): boolean {
    console.log('>>> RolesGuard.canActivate: =========================== STARTING ===========================');
    
    try {
      console.log('>>> RolesGuard.canActivate: Step 1 - Getting required roles...');
      console.log('>>> RolesGuard.canActivate: Step 1a - reflector is:', this.reflector ? 'DEFINED' : 'UNDEFINED');
      
      if (!this.reflector) {
        console.log('>>> RolesGuard.canActivate: Step 1b - No reflector available, allowing access');
        return true;
      }
      
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      
      console.log('>>> RolesGuard.canActivate: Step 2 - Required roles found:', requiredRoles);
      console.log('>>> RolesGuard.canActivate: Step 2 - Required roles type:', typeof requiredRoles);
      console.log('>>> RolesGuard.canActivate: Step 2 - Required roles array?', Array.isArray(requiredRoles));
      
      if (!requiredRoles) {
        console.log('>>> RolesGuard.canActivate: Step 3 - No required roles, allowing access');
        return true;
      }
      
      console.log('>>> RolesGuard.canActivate: Step 4 - Getting request object...');
      const request = context.switchToHttp().getRequest();
      console.log('>>> RolesGuard.canActivate: Step 5 - Request object exists:', !!request);
      
      const { user } = request;
      console.log('>>> RolesGuard.canActivate: Step 6 - User exists:', !!user);
      console.log('>>> RolesGuard.canActivate: Step 7 - User object:', user);
      console.log('>>> RolesGuard.canActivate: Step 8 - User.roles exists:', !!user?.roles);
      console.log('>>> RolesGuard.canActivate: Step 9 - User.roles value:', user?.roles);
      console.log('>>> RolesGuard.canActivate: Step 10 - User.roles type:', typeof user?.roles);
      console.log('>>> RolesGuard.canActivate: Step 11 - User.roles is array:', Array.isArray(user?.roles));
      
      if (!user) {
        console.log('>>> RolesGuard.canActivate: Step 12 - No user, denying access');
        return false;
      }
      
      if (!user.roles) {
        console.log('>>> RolesGuard.canActivate: Step 13 - No user roles, denying access');
        return false;
      }
      
      console.log('>>> RolesGuard.canActivate: Step 14 - Checking role match...');
      console.log('>>> RolesGuard.canActivate: Step 14a - Required roles:', requiredRoles);
      console.log('>>> RolesGuard.canActivate: Step 14b - User roles:', user.roles);
      
      const hasRole = requiredRoles.some((role) => {
        console.log(`>>> RolesGuard.canActivate: Step 14c - Checking if user has role "${role}"`);
        const userHasRole = user.roles.includes(role);
        console.log(`>>> RolesGuard.canActivate: Step 14d - User has role "${role}":`, userHasRole);
        return userHasRole;
      });
      
      console.log('>>> RolesGuard.canActivate: Step 15 - Final hasRole result:', hasRole);
      console.log('>>> RolesGuard.canActivate: =========================== ENDING ===========================');
      
      return hasRole;
    } catch (error) {
      console.error('>>> RolesGuard.canActivate: =========================== ERROR ===========================');
      console.error('>>> RolesGuard.canActivate: ERROR TYPE:', typeof error);
      console.error('>>> RolesGuard.canActivate: ERROR MESSAGE:', error?.message);
      console.error('>>> RolesGuard.canActivate: ERROR STACK:', error?.stack);
      console.error('>>> RolesGuard.canActivate: =========================== ERROR END ===========================');
      return false;
    }
  }
} 