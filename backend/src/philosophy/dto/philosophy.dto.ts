import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  IsObject,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTOs para las métricas filosóficas de CoomÜnity
 * Basados en los tipos compartidos de packages/shared-types
 */

export enum HambreLevel {
  BAJO = 'bajo',
  MEDIO = 'medio',
  ALTO = 'alto',
}

export class HambreMetricDto {
  @ApiProperty({
    description: 'Estado cualitativo del nivel de HambrE',
    enum: HambreLevel,
    example: 'medio',
  })
  @IsEnum(HambreLevel)
  level: HambreLevel;

  @ApiProperty({
    description: 'Valor cuantitativo del HambrE (0-100)',
    minimum: 0,
    maximum: 100,
    example: 65,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;

  @ApiProperty({
    description: 'Marca temporal de la última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateHambreDto {
  @ApiPropertyOptional({
    description: 'Nuevo nivel de HambrE',
    enum: HambreLevel,
    example: HambreLevel.ALTO,
  })
  @IsOptional()
  @IsEnum(HambreLevel)
  level?: HambreLevel;

  @ApiPropertyOptional({
    description: 'Nuevo valor de HambrE (0-100)',
    minimum: 0,
    maximum: 100,
    example: 90,
  })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional({
    description: 'Notas del Gamifier sobre el cambio',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'ID del Gamifier que realiza el cambio',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class IEAReciprocidadDto {
  @ApiProperty({
    description: 'Valor de contribución/dar al ecosistema (0-100)',
    minimum: 0,
    maximum: 100,
    example: 75,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  dar: number;

  @ApiProperty({
    description: 'Valor de recepción/consumo del ecosistema (0-100)',
    minimum: 0,
    maximum: 100,
    example: 65,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  recibir: number;

  @ApiProperty({
    description: 'Peso relativo para el cálculo final (0-1)',
    minimum: 0,
    maximum: 1,
    example: 0.8,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  ponderacion: number;

  @ApiProperty({
    description: 'Marca temporal de la última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Valor calculado del índice',
    example: 0.92,
  })
  @IsOptional()
  @IsNumber()
  indiceCalculado?: number;

  @ApiPropertyOptional({
    description: 'Metadatos del cálculo',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class PhilosophyMetricsResponseDto {
  @ApiProperty({
    description: 'Métricas de HambrE',
    type: HambreMetricDto,
  })
  @Type(() => HambreMetricDto)
  hambre: HambreMetricDto;

  @ApiProperty({
    description: 'Métricas de IEA de Reciprocidad',
    type: IEAReciprocidadDto,
  })
  @Type(() => IEAReciprocidadDto)
  iea: IEAReciprocidadDto;

  @ApiProperty({
    description: 'Marca temporal de la última sincronización',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  lastSync: string;
}
