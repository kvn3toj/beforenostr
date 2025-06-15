import { Controller, Get } from '@nestjs/common';

@Controller('playlists-simple')
export class PlaylistSimpleController {
  @Get()
  findAll() {
    return [
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Simple Test Playlist',
        description: 'Test from simple controller'
      }
    ];
  }

  @Get('test')
  test() {
    return { message: 'Simple controller working!', timestamp: new Date().toISOString() };
  }
} 