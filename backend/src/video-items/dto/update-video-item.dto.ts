import {
  IsString,
  IsInt,
  IsOptional,
  // IsArray, // Unused import
  // IsObject, // Unused import
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

  @IsString()
  @IsOptional()
  playlistId?: string;

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
