import { Injectable, CanActivate, ExecutionContext, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Optional() private readonly reflector?: Reflector) {
    console.log('>>> RolesGuard CONSTRUCTOR: Initializing...');
    console.log('>>> RolesGuard CONSTRUCTOR: reflector IS', this.reflector ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> RolesGuard CONSTRUCTOR: reflector type:', typeof this.reflector);
    
    // NO THROW ERROR - Permitir que funcione sin Reflector durante inicialización
  }

  canActivate(context: ExecutionContext): boolean {
    console.log('>>> RolesGuard.canActivate: =========================== STARTING ===========================');
    
    try {
      console.log('>>> RolesGuard.canActivate: Step 1 - Getting required roles...');
      console.log('>>> RolesGuard.canActivate: Step 1a - reflector is:', this.reflector ? 'DEFINED' : 'UNDEFINED');
      
      if (!this.reflector) {
        console.log('>>> RolesGuard.canActivate: Step 1b - No reflector available, allowing access');
        return true; // Permitir acceso si no hay reflector (modo seguro)
      }
      
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      
      console.log('>>> RolesGuard.canActivate: Step 2 - Required roles found:', requiredRoles);
      
      if (!requiredRoles) {
        console.log('>>> RolesGuard.canActivate: Step 3 - No required roles, allowing access');
        return true;
      }
      
      console.log('>>> RolesGuard.canActivate: Step 4 - Getting request object...');
      const request = context.switchToHttp().getRequest();
      const { user } = request;
      
      console.log('>>> RolesGuard.canActivate: Step 5 - User exists:', !!user);
      
      if (!user || !user.roles) {
        console.log('>>> RolesGuard.canActivate: Step 6 - No user or roles, denying access');
        return false;
      }
      
      const hasRole = requiredRoles.some((role) => user.roles.includes(role));
      console.log('>>> RolesGuard.canActivate: Step 7 - Final hasRole result:', hasRole);
      
      return hasRole;
    } catch (error) {
      console.error('>>> RolesGuard.canActivate: ERROR:', error?.message);
      return false; // Denegar acceso en caso de error
    }
  }
} 