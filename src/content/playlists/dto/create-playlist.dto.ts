import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty({ description: 'The name of the playlist' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A brief description of the playlist', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The ID of the mundo this playlist belongs to' })
  @IsUUID()
  @IsNotEmpty()
  mundoId: string;

  @ApiProperty({ description: 'Whether the playlist is active', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 