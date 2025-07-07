import { Controller, Get, Post, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('debug')
export class DebugController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get('marketplace-table')
  async checkMarketplaceTable() {
    try {
      const testQuery = await this.prisma.marketplaceItem.findFirst();
      return {
        status: 'success',
        tableExists: true,
        message: 'marketplace_items table is working correctly',
        sampleData: testQuery,
      };
    } catch (error) {
      return {
        status: 'error',
        tableExists: false,
        error: error.message,
        errorCode: error.code,
        message:
          'marketplace_items table has issues - likely missing columns or table does not exist',
      };
    }
  }

  @Post('emergency-repair-marketplace')
  async emergencyRepairMarketplace() {
    try {
      console.log('🔥 [Emergency Repair] Starting marketplace table repair...');

      // 1. Test if table exists and has correct schema
      let tableStatus = 'unknown';
      try {
        await this.prisma.marketplaceItem.findFirst();
        tableStatus = 'working';
        console.log('✅ [Emergency Repair] Table exists and is working');
      } catch (error) {
        tableStatus = 'broken';
        console.log('❌ [Emergency Repair] Table is broken:', error.message);
      }

      // 2. If table is broken, we need to apply migrations manually
      if (tableStatus === 'broken') {
        console.log('🔧 [Emergency Repair] Attempting to fix table schema...');

        // Execute the critical migration SQL directly
        const migrationSQL = `
          CREATE TABLE IF NOT EXISTS "marketplace_items" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "fullDescription" TEXT,
            "itemType" TEXT NOT NULL DEFAULT 'physical',
            "price" DOUBLE PRECISION NOT NULL,
            "priceToins" INTEGER NOT NULL DEFAULT 0,
            "currency" TEXT NOT NULL DEFAULT 'USD',
            "status" TEXT NOT NULL DEFAULT 'active',
            "category" TEXT NOT NULL,
            "tags" TEXT[],
            "images" TEXT[],
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            "createdBy" TEXT NOT NULL,
            "metadata" JSONB,
            "isDigital" BOOLEAN NOT NULL DEFAULT false,
            "downloadUrl" TEXT,

            CONSTRAINT "marketplace_items_pkey" PRIMARY KEY ("id")
          );
        `;

        await this.prisma.$executeRawUnsafe(migrationSQL);
        console.log('✅ [Emergency Repair] Table schema fixed');
      }

      // 3. Check if table has data
      const itemCount = await this.prisma.marketplaceItem.count();
      console.log(`📊 [Emergency Repair] Current item count: ${itemCount}`);

      // 4. If no data, create basic sample data
      if (itemCount === 0) {
        console.log('🌱 [Emergency Repair] Adding sample marketplace data...');

        await this.prisma.marketplaceItem.create({
          data: {
            id: 'sample-1',
            name: 'Taller de Huerto Urbano',
            description: 'Aprende a crear tu propio huerto urbano',
            itemType: 'SERVICE',
            price: 25.0,
            currency: 'UNITS',
            category: 'education',
            sellerId: 'system-user-id',
            tags: ['huerto', 'urbano', 'sostenibilidad'],
            images: ['https://example.com/huerto.jpg'],
          },
        });

        console.log('✅ [Emergency Repair] Sample data added');
      }

      // 5. Final verification
      const finalCount = await this.prisma.marketplaceItem.count();
      const sampleItem = await this.prisma.marketplaceItem.findFirst();

      return {
        status: 'success',
        message: 'Emergency marketplace repair completed successfully',
        details: {
          tableStatus: 'working',
          itemCount: finalCount,
          sampleItem: sampleItem,
          repairActions: [
            tableStatus === 'broken'
              ? 'Fixed table schema'
              : 'Table schema was already working',
            itemCount === 0 ? 'Added sample data' : 'Data already existed',
          ],
        },
      };
    } catch (error) {
      console.error('❌ [Emergency Repair] Failed:', error);
      return {
        status: 'error',
        message: 'Emergency repair failed',
        error: error.message,
        errorCode: error.code,
      };
    }
  }
}
