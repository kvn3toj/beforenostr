import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { PrismaModule } from '../prisma/prisma.module';
import { VideoItemsModule } from '../video-items/video-items.module';
import { ValidationModule } from '../common/validation/validation.module';
// import { QuestionValidationService } from './question-validation.service'; // COMENTADO TEMPORALMENTE - ARCHIVO MOVIDO
import { LoggerModule } from '../common/logger';
// import { MonitoringModule } from '../monitoring/monitoring.module'; // COMENTADO TEMPORALMENTE - CARPETA MOVIDA

console.log('>>> QuestionModule: Starting module definition...');

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    VideoItemsModule, // REACTIVADO con versión simplificada
    ValidationModule, // Para acceder a QuestionValidationService
    // MonitoringModule, // COMENTADO TEMPORALMENTE - CARPETA MOVIDA
  ],
  controllers: [
    QuestionController,
  ],
  providers: [
    // QuestionValidationService, // COMENTADO TEMPORALMENTE
    QuestionService,
    // QuestionValidationService movido a ValidationModule
  ],
  exports: [
    QuestionService,
    // QuestionValidationService movido a ValidationModule
  ],
})
export class QuestionModule {
  constructor() {
    console.log('>>> QuestionModule CONSTRUCTOR: Module initialized successfully');
    console.log('>>> QuestionModule CONSTRUCTOR: Controllers should be registered now');
  }
} 