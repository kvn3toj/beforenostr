import { Module } from '@nestjs/common';
import { QuestionGeneratorService } from './question-generator.service.js.js';
import { AiController } from './ai.controller.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [QuestionGeneratorService],
  exports: [QuestionGeneratorService],
})
export class AiModule {}
