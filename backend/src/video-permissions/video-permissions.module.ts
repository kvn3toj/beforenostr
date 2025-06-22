import { Module } from '@nestjs/common';
import { VideoPermissionsController } from './video-permissions.controller';
import { VideoPermissionsService } from './video-permissions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoPermissionsController],
  providers: [VideoPermissionsService],
  exports: [VideoPermissionsService],
})
export class VideoPermissionsModule {}
