import {
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  IsNumber,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRankingDto {
  @ApiProperty({ description: 'Nombre del ranking' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Tipo de ranking' })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Período del ranking',
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'CONTEST'],
    default: 'DAILY',
  })
  @IsString()
  @IsOptional()
  period?: string;

  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Puntuación del usuario' })
  @IsNumber()
  score: number;

  @ApiProperty({ description: 'Posición en el ranking' })
  @IsInt()
  rank: number;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales del ranking',
    example: {
      category: 'education',
      period: 'monthly',
      details: {},
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
