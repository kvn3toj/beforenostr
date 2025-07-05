import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('playlists-direct')
@Controller('playlists-direct')
export class PlaylistDirectController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    //     console.log('>>> PlaylistDirectController constructor called');
    //     console.log('>>> PlaylistDirectController constructor - prisma:', !!this.prisma);
    //     console.log('>>> PlaylistDirectController constructor - prisma type:', typeof this.prisma);
    //     console.log('>>> PlaylistDirectController constructor - prisma constructor:', this.prisma?.constructor?.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get all playlists directly' })
  @ApiResponse({ status: 200, description: 'List of playlists' })
  async findAll() {
    //     console.log('>>> PlaylistDirectController.findAll called');
    //     console.log('>>> PlaylistDirectController.findAll - prisma:', !!this.prisma);
    const playlists = await this.prisma.playlist.findMany({
      where: { isActive: true },
      include: {
        mundo: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    //       console.log('>>> PlaylistDirectController.findAll found:', playlists.length, 'playlists');
    return playlists;
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint for playlists' })
  test() {
    //     console.log('>>> PlaylistDirectController.test called');
    return {
      message: 'PlaylistDirectController is working',
      timestamp: new Date().toISOString(),
      status: HttpStatus.OK,
    };
  }

  @Get('db-test')
  @ApiOperation({ summary: 'Test database connection' })
  async dbTest() {
    //     console.log('>>> PlaylistDirectController.dbTest called');
    //     console.log('>>> PlaylistDirectController.dbTest - prisma:', !!this.prisma);
    //     console.log('>>> PlaylistDirectController.dbTest - prisma type:', typeof this.prisma);

    if (!this.prisma) {
      return {
        success: false,
        error: 'PrismaService is undefined',
        message: 'Dependency injection failed',
      };
    }

    try {
      //       console.log('>>> Testing prisma connection...');
      const result = await this.prisma.$queryRaw`SELECT 1 as test`;
      //       console.log('>>> Prisma query result:', result);
      return {
        success: true,
        result,
        message: 'Database connection successful',
      };
    } catch (error) {
      //       console.error('>>> Database test error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Database connection failed',
      };
    }
  }
}
