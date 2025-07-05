import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service.js.js';
import { FeedbackController } from './feedback.controller.js.js';
import { FeedbackAgentsService } from './agents/feedback-agents.service.js.js';
// import { AgentsController } from './controllers/agents.controller.js.js';
import { PrismaService } from '../prisma/prisma.service.js.js';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackAgentsService, PrismaService],
  exports: [FeedbackService, FeedbackAgentsService], // Exportamos ambos servicios para uso en otros módulos
})
export class FeedbackModule {}
