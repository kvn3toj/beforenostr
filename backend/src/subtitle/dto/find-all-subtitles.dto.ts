import {
  IsInt,
  IsOptional,
  IsString,
  IsIn /* , IsBoolean */,
} from 'class-validator'; // IsBoolean unused
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllSubtitlesDto {
  @ApiProperty({ description: 'Filter subtitles by video item ID' })
  @IsInt()
  @Type(() => Number)
  videoItemId: number; // Required to filter subtitles by video

  @ApiPropertyOptional({
    description: 'Filter subtitles by language code',
    example: 'es-ES',
  })
  @IsOptional()
  @IsString()
  languageCode?: string;

  @ApiPropertyOptional({
    description: 'Filter subtitles by format',
    enum: ['srt', 'vtt', 'ass'],
    example: 'srt',
  })
  @IsOptional()
  @IsString()
  @IsIn(['srt', 'vtt', 'ass'])
  format?: string;

  @ApiPropertyOptional({
    description: 'Filter subtitles by active status',
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
