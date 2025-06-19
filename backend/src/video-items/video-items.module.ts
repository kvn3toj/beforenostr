import { Module } from '@nestjs/common';
import { VideoItemsController } from './video-items.controller';
import { VideoItemsService } from './video-items.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoItemsController],
  providers: [VideoItemsService],
  exports: [VideoItemsService]
})
export class VideoItemsModule {} 