import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateVideoItemDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  platform: string;

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
  playlistId: number;

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
