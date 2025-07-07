import { /* ApiProperty, */ ApiPropertyOptional } from '@nestjs/swagger'; // ApiProperty unused
import {
  IsOptional,
  IsBoolean,
  IsUUID,
  IsInt,
  Min,
  IsString,
  IsEnum,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum PlaylistOrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindAllPlaylistsDto {
  @ApiPropertyOptional({
    description: 'ID del mundo para filtrar las playlists',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  mundoId?: string;

  @ApiPropertyOptional({
    description: 'Término de búsqueda para el nombre de la playlist',
    example: 'Introducción',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Término de búsqueda para la descripción de la playlist',
    example: 'Conceptos básicos',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo/inactivo',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description:
      'Campo por el cual ordenar los resultados (ej. name, createdAt, orderInMundo)',
    example: 'createdAt',
    default: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Dirección de ordenamiento',
    enum: PlaylistOrderDirection,
    example: PlaylistOrderDirection.DESC,
    default: PlaylistOrderDirection.DESC,
    required: false,
  })
  @IsOptional()
  @IsEnum(PlaylistOrderDirection)
  orderDirection?: PlaylistOrderDirection = PlaylistOrderDirection.DESC;

  @ApiPropertyOptional({
    description:
      'Incluir los videoItems relacionados en la respuesta de cada playlist',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  includeItems?: boolean = false;

  @ApiPropertyOptional({
    description: 'Incluir el Mundo relacionado en la respuesta',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  includeMundo?: boolean = false;

  @ApiPropertyOptional({
    description: 'Número de página para la paginación (1-indexed)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100, // Added a reasonable maximum
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Added a reasonable maximum
  limit?: number = 10; // Renamed from pageSize to limit for consistency with service

  @ApiPropertyOptional({
    description: 'ID externo del video (por ejemplo, de YouTube)',
    example: 'ixBgrqho03E',
  })
  @IsOptional()
  @IsString()
  externalId?: string;
}
