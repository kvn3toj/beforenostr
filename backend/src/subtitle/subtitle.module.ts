import { Module } from '@nestjs/common';
import { SubtitleController } from './subtitle.controller.js.js';
import { SubtitleService } from './subtitle.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';

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
