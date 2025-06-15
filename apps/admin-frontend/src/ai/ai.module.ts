import { Module } from '@nestjs/common';
import { QuestionGeneratorService } from './question-generator.service';
import { AiController } from './ai.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [QuestionGeneratorService],
  exports: [QuestionGeneratorService],
})
export class AiModule {} 