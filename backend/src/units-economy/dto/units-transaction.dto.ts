import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 🌌 Units Transaction DTOs - Transferencias de Ünits CoomÜnity
 * 
 * 🎯 INTENT: Definir contratos de datos para transacciones de Ünits transparentes y seguras
 * 🌟 VALUES: Transparencia (todos los campos visibles), Reciprocidad (balances justos), Bien Común (economía compartida)
 * ⚡ CONSTRAINTS: Validación estricta, tipos seguros, compatibilidad Swagger
 */

export enum UnitsTransactionType {
  TRANSFER = 'transfer',
  REVENUE_SHARING = 'revenue_sharing',
  RECIPROCITY_BONUS = 'reciprocity_bonus',
  COMMUNITY_REWARD = 'community_reward',
  TEMPLATE_PURCHASE = 'template_purchase',
  AYNI_EXCHANGE = 'ayni_exchange'
}

export enum UnitsTransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  REVERSED = 'reversed'
}

export class CreateUnitsTransactionDto {
  @ApiProperty({ description: 'ID del usuario receptor de Ünits' })
  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @ApiProperty({ description: 'Cantidad de Ünits a transferir', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ 
    description: 'Tipo de transacción', 
    enum: UnitsTransactionType,
    default: UnitsTransactionType.TRANSFER 
  })
  @IsEnum(UnitsTransactionType)
  type: UnitsTransactionType;

  @ApiProperty({ description: 'Concepto o descripción de la transacción', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Metadata adicional como JSON', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UnitsTransactionResponseDto {
  @ApiProperty({ description: 'ID único de la transacción' })
  id: string;

  @ApiProperty({ description: 'ID del usuario emisor' })
  senderId: string;

  @ApiProperty({ description: 'ID del usuario receptor' })
  recipientId: string;

  @ApiProperty({ description: 'Cantidad de Ünits transferida' })
  amount: number;

  @ApiProperty({ description: 'Tipo de transacción', enum: UnitsTransactionType })
  type: UnitsTransactionType;

  @ApiProperty({ description: 'Estado de la transacción', enum: UnitsTransactionStatus })
  status: UnitsTransactionStatus;

  @ApiProperty({ description: 'Descripción de la transacción' })
  description?: string;

  @ApiProperty({ description: 'Metadata de la transacción' })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Timestamp de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp de última actualización' })
  updatedAt: Date;

  @ApiProperty({ description: 'Score de reciprocidad aplicado' })
  reciprocityScore?: number;

  @ApiProperty({ description: 'Porcentaje de Ayni (reciprocidad sagrada)' })
  ayniPercentage?: number;
}

export class GetUnitsBalanceDto {
  @ApiProperty({ description: 'Balance actual de Ünits' })
  currentBalance: number;

  @ApiProperty({ description: 'Ünits pendientes de confirmación' })
  pendingBalance: number;

  @ApiProperty({ description: 'Total de Ünits ganadas históricamente' })
  totalEarned: number;

  @ApiProperty({ description: 'Total de Ünits gastadas históricamente' })
  totalSpent: number;

  @ApiProperty({ description: 'Score de reciprocidad actual (0-100)' })
  reciprocityScore: number;

  @ApiProperty({ description: 'Nivel de Ayni alcanzado' })
  ayniLevel: string;
}

export class UnitsHistoryQueryDto {
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

  @ApiProperty({ 
    description: 'Filtrar por tipo de transacción', 
    required: false,
    enum: UnitsTransactionType 
  })
  @IsOptional()
  @IsEnum(UnitsTransactionType)
  type?: UnitsTransactionType;

  @ApiProperty({ 
    description: 'Filtrar por estado', 
    required: false,
    enum: UnitsTransactionStatus 
  })
  @IsOptional()
  @IsEnum(UnitsTransactionStatus)
  status?: UnitsTransactionStatus;
}