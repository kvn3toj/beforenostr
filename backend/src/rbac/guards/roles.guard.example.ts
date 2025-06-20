import { Injectable, CanActivate, ExecutionContext, Optional, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { CoomUnityLoggerService } from '../../common/logger/logger.service';

@Injectable()
export class RolesGuardExample implements CanActivate {
  constructor(
    @Optional() private readonly reflector?: Reflector,
    @Inject(CoomUnityLoggerService) private readonly logger?: CoomUnityLoggerService
  ) {
    // 🎯 NUEVO: Solo log INFO en inicialización (no debug)
    this.logger?.info('RolesGuard initialized', { module: 'RolesGuard' });
  }

  canActivate(context: ExecutionContext): boolean {
    const startTime = Date.now();

    try {
      // 🎯 NUEVO: Solo debug, no info - se controla por LOG_LEVEL
      this.logger?.debug('Authorization check started', { module: 'RolesGuard' });

      if (!this.reflector) {
        this.logger?.warn('No reflector available, allowing access by default', { module: 'RolesGuard' });
        return true;
      }

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        this.logger?.debug('No roles required, allowing access', { module: 'RolesGuard' });
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const { user } = request;

      if (!user || !user.roles) {
        // 🎯 NUEVO: Log de acceso denegado con contexto
        this.logger?.rbac('Access denied - no user or roles', {
          requiredRoles,
          hasUser: !!user,
          hasRoles: !!user?.roles
        });
        return false;
      }

      const hasRole = requiredRoles.some((role) => user.roles.includes(role));

      const duration = Date.now() - startTime;

      if (hasRole) {
        // 🎯 NUEVO: Log de éxito con contexto mínimo
        this.logger?.rbac('Access granted', {
          userId: user.id,
          userRoles: user.roles,
          requiredRoles: requiredRoles,
          grantedRole: requiredRoles.find(role => user.roles.includes(role))
        });
      } else {
        // 🎯 NUEVO: Log de acceso denegado con contexto completo
        this.logger?.rbac('Access denied - insufficient roles', {
          userId: user.id,
          userRoles: user.roles,
          requiredRoles: requiredRoles
        });
      }

      // 🎯 NUEVO: Log de performance solo si es lento
      if (duration > 100) {
        this.logger?.performance('canActivate', duration, { module: 'RolesGuard' });
      }

      return hasRole;
    } catch (error) {
      const duration = Date.now() - startTime;

      // 🎯 NUEVO: Log de error estructurado
      this.logger?.error('Authorization check failed', error instanceof Error ? error.stack : undefined, {
        module: 'RolesGuard',
        duration
      });

      return false;
    }
  }
}
