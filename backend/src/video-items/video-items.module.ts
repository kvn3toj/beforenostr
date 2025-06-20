import { Module } from '@nestjs/common';
import { VideoItemsController } from './video-items.controller';
import { VideoItemsService } from './video-items.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { MetricsModule } from '../common/metrics/metrics.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [PrismaModule, CacheModule, MetricsModule, LoggerModule],
  controllers: [VideoItemsController],
  providers: [VideoItemsService],
  exports: [VideoItemsService]
})
export class VideoItemsModule {}
