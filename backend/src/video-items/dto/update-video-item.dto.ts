import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';

export class UpdateVideoItemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsString()
  @IsOptional()
  externalId?: string;

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsInt()
  @IsOptional()
  playlistId?: number;

  @IsInt()
  @IsOptional()
  itemTypeId?: number;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsObject()
  @IsOptional()
  quality?: Record<string, unknown>;
}
