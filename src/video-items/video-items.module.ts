import { Module } from '@nestjs/common';
import { VideoItemsController } from './video-items.controller';
import { VideoItemsService } from './video-items.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { LoggerService } from '../common/logger';
import { MetricsService } from '../common/metrics/metrics.service';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [VideoItemsController],
  providers: [VideoItemsService, LoggerService, MetricsService],
  exports: [VideoItemsService]
})
export class VideoItemsModule {} 