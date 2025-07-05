import { Module } from '@nestjs/common';
import { CacheService } from './cache.service.js.js';
import { MetricsModule } from '../common/metrics/metrics.module.js.js';
import { LoggerModule } from '../common/logger/logger.module.js.js';

@Module({
  imports: [MetricsModule, LoggerModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
