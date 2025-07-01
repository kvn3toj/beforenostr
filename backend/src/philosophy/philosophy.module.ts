import { Module } from '@nestjs/common';
import { PhilosophyController } from './philosophy.controller';
import { PhilosophyService } from './philosophy.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { MetricsModule } from '../common/metrics/metrics.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [PrismaModule, CacheModule, MetricsModule, LoggerModule],
  controllers: [PhilosophyController],
  providers: [PhilosophyService],
  exports: [PhilosophyService],
})
export class PhilosophyModule {
  constructor() {
    console.log('🌌 PhilosophyModule CONSTRUCTOR: Activando la Consola de Experiencias del corazón filosófico...');
  }
}
