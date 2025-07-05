import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service.js.js';
import { MetricsController } from './metrics.controller.js.js';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
