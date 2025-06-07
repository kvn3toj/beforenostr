import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {
    console.log('>>> RolesGuard CONSTRUCTOR: this.reflector IS', this.reflector ? 'DEFINED' : 'UNDEFINED');
  }

  canActivate(context: ExecutionContext): boolean {
    console.log('>>> RolesGuard canActivate: ENTERING METHOD');
    
    if (!this.reflector) {
      console.log('>>> RolesGuard canActivate: ERROR - Reflector is undefined, allowing access');
      return true;
    }
    
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    console.log('>>> RolesGuard canActivate: requiredRoles:', requiredRoles);
    
    if (!requiredRoles) {
      console.log('>>> RolesGuard canActivate: No roles required, allowing access');
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    console.log('>>> RolesGuard canActivate: user:', user ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> RolesGuard canActivate: user.roles:', user?.roles);
    
    if (!user || !user.roles) {
      console.log('>>> RolesGuard canActivate: No user or roles, denying access');
      return false;
    }
    
    const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
    console.log('>>> RolesGuard canActivate: hasRequiredRole:', hasRequiredRole);
    
    return hasRequiredRole;
  }
} 