import { Module } from '@nestjs/common';
import { VideoPermissionsController } from './video-permissions.controller.js.js';
import { VideoPermissionsService } from './video-permissions.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';

@Module({
  imports: [PrismaModule],
  controllers: [VideoPermissionsController],
  providers: [VideoPermissionsService],
  exports: [VideoPermissionsService],
})
export class VideoPermissionsModule {}
