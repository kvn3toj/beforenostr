import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePlaylistDto {
  @ApiProperty({
    description: 'ID del mundo al que pertenece la playlist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  mundoId: string;

  @ApiProperty({
    description: 'Nombre de la playlist',
    example: 'Introducción a TypeScript',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Descripción de la playlist',
    example:
      'Una serie de videos introductorios sobre TypeScript para principiantes',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL de la imagen o thumbnail de la playlist',
    example: 'https://example.com/images/typescript-intro.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Orden de la playlist dentro del mundo',
    example: 1,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  orderInMundo?: number = 0;

  @ApiProperty({
    description: 'Estado activo/inactivo de la playlist',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Fecha de publicación (no se persiste en DB actualmente)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  published_at?: string;

  @ApiProperty({
    description: 'Fecha de despublicación (no se persiste en DB actualmente)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  unpublished_at?: string;

  @IsOptional()
  @IsString()
  mundo_id?: string;
}
