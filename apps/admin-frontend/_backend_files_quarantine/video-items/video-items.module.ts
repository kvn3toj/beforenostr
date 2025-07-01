import { Module } from '@nestjs/common';
import { VideoItemsController } from './video-items.controller';

@Module({
  imports: [],
  controllers: [VideoItemsController],
  providers: [],
  exports: []
})
export class VideoItemsModule {} 