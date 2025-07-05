import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistDirectController } from './playlist-direct.controller';
import { PlaylistService } from './playlist.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlaylistController, PlaylistDirectController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {
  constructor() {
    // // //     console.log('>>> PlaylistModule CONSTRUCTOR: Initializing...');
  }
}
