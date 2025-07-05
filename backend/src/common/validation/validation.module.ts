import { Module } from '@nestjs/common';
import { QuestionValidationService } from './question-validation.service.js.js';
import { PrismaModule } from '../../prisma/prisma.module.js.js';
import { VideoItemsModule } from '../../video-items/video-items.module.js.js';
import { NotificationModule } from '../notifications/notification.module.js.js';

@Module({
  imports: [
    PrismaModule,
    VideoItemsModule,
    NotificationModule, // Para acceder a NotificationService
  ],
  providers: [QuestionValidationService],
  exports: [QuestionValidationService],
})
export class ValidationModule {
  constructor() {
    // //     console.log('>>> ValidationModule CONSTRUCTOR: Initializing validation system...');
  }
}
