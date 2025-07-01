import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { CreatePlaylistDto } from './create-playlist.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  mundoId?: string;

  @ApiProperty({ description: 'Whether the playlist is soft deleted', required: false })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
} 