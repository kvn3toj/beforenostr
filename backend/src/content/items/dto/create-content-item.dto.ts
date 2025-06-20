import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUUID, IsInt, Min, Max, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContentItemDto {
  @ApiProperty({ description: 'The title of the content item' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'A brief description of the content item', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The ID of the playlist this item belongs to' })
  @IsUUID()
  @IsNotEmpty()
  playlistId: string;

  @ApiProperty({ description: 'The ID of the item type (e.g., video, article)' })
  @IsUUID()
  @IsNotEmpty()
  itemTypeId: string;

  @ApiProperty({ description: 'The content data (e.g., video URL, article text, JSON)' })
  // Use IsString and IsJSON if content is always JSON string, or adjust based on actual content type
  @IsString() 
  @IsNotEmpty()
  content: string; // Assuming content is stored as a string (e.g., JSON string, URL)

  @ApiProperty({ description: 'The order of the item within the playlist', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ description: 'Whether the item is active', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // Potentially add fields for versioning/scheduling if the schema supports it
  // @ApiProperty({ description: 'Scheduled publication date/time', required: false })
  // @IsDateString()
  // @IsOptional()
  // scheduledAt?: string;

  // @ApiProperty({ description: 'End date/time for availability', required: false })
  // @IsDateString()
  // @IsOptional()
  // endsAt?: string;
} 