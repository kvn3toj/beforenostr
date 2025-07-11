import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 🌌 Revenue Sharing DTOs - Distribución de Ingresos CoomÜnity
 * 
 * 🎯 INTENT: Automatizar distribución equitativa de ingresos según contribuciones y Ayni
 * 🌟 VALUES: Bien Común (beneficio compartido), Reciprocidad (retorno justo), Transparencia (distribución visible)
 * ⚡ CONSTRAINTS: Matemáticas precisas, validación estricta, trazabilidad completa
 */

export class RevenueSharingParticipantDto {
  @ApiProperty({ description: 'ID del participante en la distribución' })
  @IsNotEmpty()
  @IsString()
  participantId: string;

  @ApiProperty({ description: 'Porcentaje de participación (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({ description: 'Tipo de contribución', required: false })
  @IsOptional()
  @IsString()
  contributionType?: string;

  @ApiProperty({ description: 'Score de reciprocidad del participante', required: false })
  @IsOptional()
  @IsNumber()
  reciprocityScore?: number;
}

export class CreateRevenueSharingDto {
  @ApiProperty({ description: 'Monto total de Ünits a distribuir' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalAmount: number;

  @ApiProperty({ description: 'ID del template o producto que genera ingresos' })
  @IsNotEmpty()
  @IsString()
  sourceId: string;

  @ApiProperty({ description: 'Tipo de fuente de ingresos (template, challenge, etc.)' })
  @IsNotEmpty()
  @IsString()
  sourceType: string;

  @ApiProperty({ 
    description: 'Lista de participantes en la distribución',
    type: [RevenueSharingParticipantDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevenueSharingParticipantDto)
  participants: RevenueSharingParticipantDto[];

  @ApiProperty({ description: 'Descripción del concepto de distribución', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Aplicar bonificación de Ayni', required: false, default: true })
  @IsOptional()
  applyAyniBenefit?: boolean = true;

  @ApiProperty({ description: 'Metadata adicional', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class RevenueSharingCalculationDto {
  @ApiProperty({ description: 'ID del participante' })
  participantId: string;

  @ApiProperty({ description: 'Monto base calculado' })
  baseAmount: number;

  @ApiProperty({ description: 'Bonificación por reciprocidad' })
  reciprocityBonus: number;

  @ApiProperty({ description: 'Bonificación de Ayni aplicada' })
  ayniBonus: number;

  @ApiProperty({ description: 'Monto final a recibir' })
  finalAmount: number;

  @ApiProperty({ description: 'Porcentaje final efectivo' })
  effectivePercentage: number;
}

export class RevenueSharingResponseDto {
  @ApiProperty({ description: 'ID único de la distribución' })
  id: string;

  @ApiProperty({ description: 'Monto total distribuido' })
  totalAmount: number;

  @ApiProperty({ description: 'Fuente de los ingresos' })
  sourceId: string;

  @ApiProperty({ description: 'Tipo de fuente' })
  sourceType: string;

  @ApiProperty({ description: 'Estado de la distribución' })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @ApiProperty({ 
    description: 'Cálculos detallados por participante',
    type: [RevenueSharingCalculationDto]
  })
  calculations: RevenueSharingCalculationDto[];

  @ApiProperty({ description: 'Total de Ünits distribuidas efectivamente' })
  totalDistributed: number;

  @ApiProperty({ description: 'Ünits sobrantes por redondeos' })
  remainder: number;

  @ApiProperty({ description: 'Descripción de la distribución' })
  description?: string;

  @ApiProperty({ description: 'Timestamp de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp de finalización', required: false })
  completedAt?: Date;

  @ApiProperty({ description: 'IDs de transacciones generadas' })
  transactionIds: string[];
}

export class RevenueSharingHistoryQueryDto {
  @ApiProperty({ description: 'Página de resultados', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Resultados por página', required: false, default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({ description: 'Filtrar por tipo de fuente', required: false })
  @IsOptional()
  @IsString()
  sourceType?: string;

  @ApiProperty({ description: 'Filtrar por ID de participante', required: false })
  @IsOptional()
  @IsString()
  participantId?: string;

  @ApiProperty({ description: 'Fecha desde (ISO string)', required: false })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiProperty({ description: 'Fecha hasta (ISO string)', required: false })
  @IsOptional()
  @IsString()
  toDate?: string;
}