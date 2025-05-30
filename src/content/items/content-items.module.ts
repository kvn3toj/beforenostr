import { Module } from '@nestjs/common';
import { ContentItemsController } from './content-items.controller';
import { ContentItemsService } from './content-items.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { VideoItemsModule } from '../../video-items/video-items.module';

@Module({
  imports: [PrismaModule, VideoItemsModule],
  controllers: [ContentItemsController],
  providers: [ContentItemsService],
  exports: [ContentItemsService],
})
export class ContentItemsModule {} 