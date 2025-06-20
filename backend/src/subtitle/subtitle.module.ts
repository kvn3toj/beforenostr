import { Module } from '@nestjs/common';
import { SubtitleController } from './subtitle.controller';
import { SubtitleService } from './subtitle.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubtitleController],
  providers: [SubtitleService],
  exports: [SubtitleService],
})
export class SubtitleModule {
  constructor() {
//     console.log('>>> SubtitleModule constructor called');
  }
} 