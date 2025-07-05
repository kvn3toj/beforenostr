import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { AnalyticsService } from './analytics.service.js.js';
import { AnalyticsController } from './analytics.controller.js.js';

@Module({
  imports: [PrismaModule],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
