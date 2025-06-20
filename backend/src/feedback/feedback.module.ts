import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackAgentsService } from './agents/feedback-agents.service';
import { AgentsController } from './controllers/agents.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [
    FeedbackController,
    AgentsController
  ],
  providers: [
    FeedbackService,
    FeedbackAgentsService,
    PrismaService
  ],
  exports: [
    FeedbackService,
    FeedbackAgentsService
  ], // Exportamos ambos servicios para uso en otros módulos
})
export class FeedbackModule {}
