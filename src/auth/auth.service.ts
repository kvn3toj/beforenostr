import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
// import { AuditLogsService } from '../admin/audit-logs/audit-logs.service'; // COMENTADO TEMPORALMENTE - CARPETA MOVIDA
// import { UsersService } from '../users/users.service'; // COMENTADO TEMPORALMENTE - DEPENDENCIA CIRCULAR

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    // @Inject(AuditLogsService) private readonly auditLogsService: AuditLogsService, // COMENTADO TEMPORALMENTE - CARPETA MOVIDA
    // private readonly usersService: UsersService, // COMENTADO TEMPORALMENTE - DEPENDENCIA CIRCULAR
  ) {
    console.log('>>> AuthService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> AuthService CONSTRUCTOR: this.jwtService IS', this.jwtService ? 'DEFINED' : 'UNDEFINED');
    // console.log('>>> AuthService CONSTRUCTOR: this.auditLogsService IS', this.auditLogsService ? 'DEFINED' : 'UNDEFINED');
  }

  async validateUser(email: string, password: string) {
    console.log('>>> AuthService validateUser called for:', email);
    
    try {
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
        console.log('>>> AuthService validateUser: User not found');
        return null;
      }

      // Verify password with bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        console.log('>>> AuthService validateUser: Invalid password');
        return null;
      }

      console.log('>>> AuthService validateUser: User authenticated successfully');
      
      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('>>> AuthService validateUser error:', error);
      return null;
    }
  }

  async login(dto: LoginDto) {
    console.log('>>> AuthService login called with:', dto.email);
    
    try {
      const user = await this.validateUser(dto.email, dto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Extract roles and permissions from user data
      const roles = user.userRoles?.map(userRole => userRole.role.name) || [];
      const permissions = user.userRoles?.flatMap(userRole => 
        userRole.role.rolePermissions?.map(rolePermission => rolePermission.permission.name) || []
      ) || [];

      console.log('>>> AuthService login: User roles:', roles);
      console.log('>>> AuthService login: User permissions:', permissions);

      // Create JWT payload
      const payload = { 
        sub: user.id,
        email: user.email,
        name: user.name,
        roles: roles,
        permissions: permissions,
        iat: Math.floor(Date.now() / 1000)
      };
      
      console.log('>>> AuthService login: Creating JWT with payload:', payload);
      
      const access_token = this.jwtService.sign(payload);
      
      console.log('>>> AuthService login: JWT created successfully');

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
      console.error('>>> AuthService login error:', error);
      throw error;
    }
  }

  async register(dto: RegisterDto) {
    console.log('>>> AuthService register called with:', dto.email);
    
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

      if (existingUser) {
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

      console.log('>>> AuthService register: User roles:', roles);
      console.log('>>> AuthService register: User permissions:', permissions);

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
      console.error('>>> AuthService register error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    console.log('>>> AuthService getCurrentUser called');
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