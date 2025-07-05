import { Module } from '@nestjs/common';
import { PhilosophyController } from './philosophy.controller.js.js';
import { PhilosophyService } from './philosophy.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { CacheModule } from '../cache/cache.module.js.js';
import { MetricsModule } from '../common/metrics/metrics.module.js.js';
import { LoggerModule } from '../common/logger/logger.module.js.js';

@Module({
  imports: [PrismaModule, CacheModule, MetricsModule, LoggerModule],
  controllers: [PhilosophyController],
  providers: [PhilosophyService],
  exports: [PhilosophyService],
})
export class PhilosophyModule {
  constructor() {
    console.log(
      '🌌 PhilosophyModule CONSTRUCTOR: Activando la Consola de Experiencias del corazón filosófico...'
    );
  }
}
