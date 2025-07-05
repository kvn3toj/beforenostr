import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { MetricsModule } from '../common/metrics/metrics.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [MetricsModule, LoggerModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
