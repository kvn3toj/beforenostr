import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('users-debug')
@Controller('users-debug')
export class DebugUsersController {
  constructor(
    private readonly prisma: PrismaService
  ) {
    console.log('>>> DebugUsersController CONSTRUCTOR: Initializing...');
    console.log('>>> DebugUsersController CONSTRUCTOR: prisma:', !!this.prisma);
    console.log('>>> DebugUsersController CONSTRUCTOR: prisma.user:', !!this.prisma?.user);
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint para verificar que el controlador debug funciona' })
  test() {
    console.log('>>> DebugUsersController.test called');
    return { 
      message: 'Debug Users controller is working!', 
      timestamp: new Date().toISOString(),
      prismaAvailable: !!this.prisma
    };
  }

  @Get('db-test')
  @ApiOperation({ summary: 'Test directo de Prisma' })
  async dbTest() {
    try {
      console.log('>>> DebugUsersController.dbTest called');
      console.log('>>> DebugUsersController.dbTest - this.prisma:', !!this.prisma);
      console.log('>>> DebugUsersController.dbTest - this.prisma.user:', !!this.prisma?.user);
      
      if (!this.prisma) {
        return { 
          message: 'Debug DB test endpoint working!', 
          timestamp: new Date().toISOString(),
          prisma: 'Prisma not available',
          error: 'PrismaService is not injected'
        };
      }
      
      if (!this.prisma.user) {
        return { 
          message: 'Debug DB test endpoint working!', 
          timestamp: new Date().toISOString(),
          prisma: 'Prisma available but user model not found',
          error: 'User model is not available in Prisma client'
        };
      }
      
      const users = await this.prisma.user.findMany();
      console.log('>>> DebugUsersController.dbTest - users found:', users.length);
      
      return { 
        message: 'Debug DB test endpoint working!', 
        timestamp: new Date().toISOString(),
        prisma: 'Prisma available',
        usersCount: users.length,
        users: users
      };
    } catch (error) {
      console.error('>>> DebugUsersController.dbTest - Error:', error);
      return { error: error.message };
    }
  }
} 