import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { VideoItemsModule } from '../video-items/video-items.module';
import { CacheModule } from '../cache/cache.module';
import { NotificationModule } from '../common/notifications/notification.module';
import { ValidationModule } from '../common/validation/validation.module';
// import { QuestionModule } from '../questions/question.module'; // COMENTADO TEMPORALMENTE PARA DIAGNÓSTICO

@Module({
  imports: [
    ScheduleModule.forRoot(), // Habilitar el sistema de cron jobs
    VideoItemsModule,         // Para acceder a VideoItemsService
    CacheModule,              // Para acceder a CacheService
    NotificationModule,       // Para acceder a NotificationService (antiguo AlertService)
    ValidationModule,         // Para acceder a QuestionValidationService
    // forwardRef(() => QuestionModule), // ✅ COMENTADO TEMPORALMENTE PARA DIAGNÓSTICO
  ],
  controllers: [MonitoringController],
  providers: [
    MonitoringService,
    // AlertService fue movido a NotificationModule
  ],
  exports: [
    MonitoringService,
    // AlertService fue movido a NotificationModule
  ],
})
export class MonitoringModule {
  constructor() {
    console.log('>>> MonitoringModule CONSTRUCTOR: Initializing monitoring system...');
  }
} 