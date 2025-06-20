import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../admin/audit-logs/audit-logs.service';
import { CoomUnityLoggerService } from '../common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(AuditLogsService) private readonly auditLogsService: AuditLogsService,
    @Inject(CoomUnityLoggerService) private readonly logger: CoomUnityLoggerService,
  ) {
    this.logger.info('AuthService initialized', { module: 'AuthService' });
  }

  async validateUser(email: string, password: string) {
    const startTime = Date.now();

    try {
      this.logger.auth('User validation started', { email });

      // Find user in database by email
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
        this.logger.auth('User not found', { email });
        return null;
      }

      // Verify password with bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.auth('Invalid password', { email });
        return null;
      }

      const duration = Date.now() - startTime;
      this.logger.auth('User authenticated successfully', {
        email,
        roles: user.userRoles?.length || 0,
        permissions: user.userRoles?.flatMap(ur => ur.role.rolePermissions).length || 0
      });
      this.logger.performance('validateUser', duration, { module: 'AuthService' });

      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      const duration = Date.now() - startTime;
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
      this.logger.auth('Login attempt started', { email: dto.email });

      const user = await this.validateUser(dto.email, dto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Extract roles and permissions from user data
      const roles = user.userRoles?.map(userRole => userRole.role.name) || [];
      const permissions = user.userRoles?.flatMap(userRole =>
        userRole.role.rolePermissions?.map(rolePermission => rolePermission.permission.name) || []
      ) || [];

      this.logger.auth('Roles and permissions extracted', {
        email: dto.email,
        rolesCount: roles.length,
        permissionsCount: permissions.length
      });

      // Create JWT payload
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

      // Log successful login
      this.logger.userAction(user.id, 'LOGIN_SUCCESS', {
        email: dto.email,
        rolesCount: roles.length,
        permissionsCount: permissions.length
      });

      this.logger.performance('login', duration, { module: 'AuthService' });

      // Log audit entry - TEMPORARILY DISABLED FOR TESTING
      // await this.auditLogsService.createLog({
      //   action: 'LOGIN',
      //   entityType: 'User',
      //   entityId: user.id,
      //   userId: user.id,
      //   details: { email: user.email },
      // });

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
      this.logger.error('Login failed', error instanceof Error ? error.stack : undefined, {
        module: 'AuthService',
        email: dto.email,
        duration
      });

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
      this.logger.auth('Registration attempt started', { email: dto.email });

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

      if (existingUser) {
        this.logger.auth('Registration failed - user exists', { email: dto.email });
        throw new ConflictException('User with this email already exists');
      }

      // Hash password with bcrypt
      const hashedPassword = await bcrypt.hash(dto.password, 12);

      // Create user in database
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

      // Extract roles and permissions from user data
      const roles = user.userRoles?.map(userRole => userRole.role.name) || [];
      const permissions = user.userRoles?.flatMap(userRole =>
        userRole.role.rolePermissions?.map(rolePermission => rolePermission.permission.name) || []
      ) || [];

      // Create JWT payload
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

      // Log successful registration
      this.logger.userAction(user.id, 'REGISTER_SUCCESS', {
        email: dto.email,
        name: user.name
      });

      this.logger.business('USER_REGISTERED', {
        userId: user.id,
        email: dto.email,
        registrationMethod: 'standard'
      });

      this.logger.performance('register', duration, { module: 'AuthService' });

      // Log audit entry - TEMPORARILY DISABLED FOR TESTING
      // await this.auditLogsService.createLog({
      //   action: 'REGISTER',
      //   entityType: 'User',
      //   entityId: user.id,
      //   userId: user.id,
      //   details: { email: user.email },
      // });

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
      this.logger.error('Registration failed', error instanceof Error ? error.stack : undefined, {
        module: 'AuthService',
        email: dto.email,
        duration
      });

      this.logger.userAction('unknown', 'REGISTER_FAILED', {
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  async getCurrentUser() {
    this.logger.debug('getCurrentUser called - returning mock data', { module: 'AuthService' });

    // For now, return a mock current user
    // In a real implementation, this would get the user from the JWT payload
    return {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@gamifier.com',
      name: 'Administrator',
      avatarUrl: null,
      roles: ['admin'],
      permissions: ['admin:all']
    };
  }
}
