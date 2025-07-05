import { Module } from '@nestjs/common';
import { VideoItemsController } from './video-items.controller.js.js';
import { VideoItemsService } from './video-items.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { CacheModule } from '../cache/cache.module.js.js';
import { MetricsModule } from '../common/metrics/metrics.module.js.js';
import { LoggerModule } from '../common/logger/logger.module.js.js';

@Module({
  imports: [PrismaModule, CacheModule, MetricsModule, LoggerModule],
  controllers: [VideoItemsController],
  providers: [VideoItemsService],
  exports: [VideoItemsService],
})
export class VideoItemsModule {}
