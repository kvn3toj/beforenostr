import { Module } from '@nestjs/common';
import { VideoItemsController } from './video-items.controller';
import { VideoItemsService } from './video-items.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [VideoItemsController],
  providers: [VideoItemsService],
  exports: [VideoItemsService],
})
export class VideoItemsModule {} 