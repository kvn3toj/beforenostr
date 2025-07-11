import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';

@Module({
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
  exports: [PlaylistsService]
})
export class PlaylistsModule {} 