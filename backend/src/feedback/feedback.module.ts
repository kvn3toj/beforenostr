import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService],
  exports: [FeedbackService], // Exportamos el servicio para uso en otros módulos (futuras funcionalidades de la CoP)
})
export class FeedbackModule {}
