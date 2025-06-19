import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateContentItemDto } from './create-content-item.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateContentItemDto extends PartialType(CreateContentItemDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  playlistId?: string;

  @IsString()
  @IsOptional()
  itemTypeId?: string;

  @ApiProperty({ description: 'Whether the content item is soft deleted', required: false })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
} 