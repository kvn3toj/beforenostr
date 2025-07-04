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

  @IsString()
  playlistId: string;

  @IsString()
  @IsOptional()
  itemTypeId?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  categories?: string;

  @IsString()
  @IsOptional()
  quality?: string;
}
