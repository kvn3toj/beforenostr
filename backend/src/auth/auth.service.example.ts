import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../admin/audit-logs/audit-logs.service';
import { CoomUnityLoggerService } from '../common/logger/logger.service';

@Injectable()
export class AuthServiceExample {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(AuditLogsService) private readonly auditLogsService: AuditLogsService,
    @Inject(CoomUnityLoggerService) private readonly logger: CoomUnityLoggerService,
  ) {
    // 🎯 NUEVO: Log de inicialización profesional
    this.logger.info('AuthService initialized', { module: 'AuthService' });
  }

  async validateUser(email: string, password: string) {
    const startTime = Date.now();

    try {
      // 🎯 NUEVO: Log específico de autenticación con contexto
      this.logger.auth('User validation started', { email });

      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        // 🎯 NUEVO: Log específico sin exponer información sensible
        this.logger.auth('User not found', { email });
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        // 🎯 NUEVO: Log de contraseña inválida
        this.logger.auth('Invalid password', { email });
        return null;
      }

      const duration = Date.now() - startTime;

      // 🎯 NUEVO: Log de éxito con métricas
      this.logger.auth('User authenticated successfully', {
        email,
        roles: user.userRoles?.length || 0,
        permissions: user.userRoles?.flatMap(ur => ur.role.rolePermissions).length || 0
      });

      // 🎯 NUEVO: Log de performance automático
      this.logger.performance('validateUser', duration, { module: 'AuthService' });

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      const duration = Date.now() - startTime;

      // 🎯 NUEVO: Log de error estructurado con contexto completo
      this.logger.error('User validation failed', error instanceof Error ? error.stack : undefined, {
        module: 'AuthService',
        email,
        duration
      });
      return null;
    }
  }

  async login(dto: LoginDto) {
    const startTime = Date.now();

    try {
      // 🎯 NUEVO: Log de inicio de sesión
      this.logger.auth('Login attempt started', { email: dto.email });

      const user = await this.validateUser(dto.email, dto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const roles = user.userRoles?.map(userRole => userRole.role.name) || [];
      const permissions = user.userRoles?.flatMap(userRole =>
        userRole.role.rolePermissions?.map(rolePermission => rolePermission.permission.name) || []
      ) || [];

      // 🎯 NUEVO: Log de roles extraídos
      this.logger.auth('Roles and permissions extracted', {
        email: dto.email,
        rolesCount: roles.length,
        permissionsCount: permissions.length
      });

      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        roles: roles,
        permissions: permissions,
        iat: Math.floor(Date.now() / 1000)
      };

      const access_token = this.jwtService.sign(payload);

      const duration = Date.now() - startTime;

      // 🎯 NUEVO: Log de acción de usuario
      this.logger.userAction(user.id, 'LOGIN_SUCCESS', {
        email: dto.email,
        rolesCount: roles.length,
        permissionsCount: permissions.length
      });

      // 🎯 NUEVO: Log de performance
      this.logger.performance('login', duration, { module: 'AuthService' });

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          roles: roles,
          permissions: permissions
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      // 🎯 NUEVO: Log de error con contexto completo
      this.logger.error('Login failed', error instanceof Error ? error.stack : undefined, {
        module: 'AuthService',
        email: dto.email,
        duration
      });

      // 🎯 NUEVO: Log de acción fallida
      this.logger.userAction('unknown', 'LOGIN_FAILED', {
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  async register(dto: RegisterDto) {
    const startTime = Date.now();

    try {
      // 🎯 NUEVO: Log de registro iniciado
      this.logger.auth('Registration attempt started', { email: dto.email });

      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

      if (existingUser) {
        this.logger.auth('Registration failed - user exists', { email: dto.email });
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 12);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name || dto.email.split('@')[0],
          password: hashedPassword,
          avatarUrl: null,
        },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      const roles = user.userRoles?.map(userRole => userRole.role.name) || [];
      const permissions = user.userRoles?.flatMap(userRole =>
        userRole.role.rolePermissions?.map(rolePermission => rolePermission.permission.name) || []
      ) || [];

      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        roles: roles,
        permissions: permissions,
        iat: Math.floor(Date.now() / 1000)
      };

      const access_token = this.jwtService.sign(payload);

      const duration = Date.now() - startTime;

      // 🎯 NUEVO: Log de acción de usuario exitosa
      this.logger.userAction(user.id, 'REGISTER_SUCCESS', {
        email: dto.email,
        name: user.name
      });

      // 🎯 NUEVO: Log de evento de negocio
      this.logger.business('USER_REGISTERED', {
        userId: user.id,
        email: dto.email,
        registrationMethod: 'standard'
      });

      // 🎯 NUEVO: Log de performance
      this.logger.performance('register', duration, { module: 'AuthService' });

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          roles: roles,
          permissions: permissions
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      // 🎯 NUEVO: Log de error estructurado
      this.logger.error('Registration failed', error instanceof Error ? error.stack : undefined, {
        module: 'AuthService',
        email: dto.email,
        duration
      });

      // 🎯 NUEVO: Log de acción fallida
      this.logger.userAction('unknown', 'REGISTER_FAILED', {
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }
}
