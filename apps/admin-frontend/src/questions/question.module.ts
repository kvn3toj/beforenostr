import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import PrismaModule to make PrismaService available
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService], // Export if needed by other modules
})
export class QuestionModule {} 