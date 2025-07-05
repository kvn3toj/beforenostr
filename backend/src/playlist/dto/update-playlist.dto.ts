import { PartialType } from '@nestjs/swagger';
import { CreatePlaylistDto } from './create-playlist.dto.js.js';

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {}
