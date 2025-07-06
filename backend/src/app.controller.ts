import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running',
      appService: 'available',
      endpoints: {
        health: 'OK',
        auth: 'OK',
        api: 'OK',
      },
    };
  }

  // Endpoint de diagnóstico temporal para verificar marketplace_items
  @Get('debug/marketplace-table')
  async debugMarketplaceTable() {
    try {
      // Intentar contar los items de marketplace
      const count = await this.prisma.marketplaceItem.count();

      // Intentar obtener la estructura de la tabla
      const sampleItem = await this.prisma.marketplaceItem.findFirst({
        select: {
          id: true,
          name: true,
          itemType: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        status: 'success',
        tableExists: true,
        itemCount: count,
        sampleItem: sampleItem || 'No items found',
        message: 'marketplace_items table is accessible',
      };
    } catch (error) {
      return {
        status: 'error',
        tableExists: false,
        error: error.message,
        errorCode: error.code,
        message: 'marketplace_items table has issues',
      };
    }
  }
}
