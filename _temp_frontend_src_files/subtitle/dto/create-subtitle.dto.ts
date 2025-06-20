import { IsInt, IsString, IsIn, IsOptional, IsUrl, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubtitleDto {
  @IsInt()
  @Type(() => Number)
  videoItemId: number;

  @IsString()
  languageCode: string; // Longitud aumentada en Prisma, pero aquí es solo string

  @IsString()
  @IsIn(['srt', 'vtt'])
  format: 'srt' | 'vtt';

  @ValidateIf(o => !o.contentUrl) // 'content' es opcional si 'contentUrl' está presente
  @IsString()
  content?: string; // Contenido plano

  @ValidateIf(o => !o.content) // 'contentUrl' es opcional si 'content' está presente
  @IsUrl()
  contentUrl?: string; // URL externa

  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
} 