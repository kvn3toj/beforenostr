import { Module } from '@nestjs/common';
import { QuestionValidationService } from './question-validation.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { VideoItemsModule } from '../../video-items/video-items.module';
import { NotificationModule } from '../notifications/notification.module';

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
