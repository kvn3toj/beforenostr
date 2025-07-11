import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 🌌 Reciprocity DTOs - Sistema de Reciprocidad y Ayni CoomÜnity
 * 
 * 🎯 INTENT: Medir y recompensar reciprocidad en la comunidad según principios de Ayni
 * 🌟 VALUES: Ayni (reciprocidad sagrada), Bien Común (equilibrio comunitario), Metanöia (transformación de conciencia)
 * ⚡ CONSTRAINTS: Algoritmos justos, medición transparente, incentivos balanceados
 */

export enum ReciprocityEventType {
  GIVE = 'give',              // Acción de dar/contribuir
  RECEIVE = 'receive',        // Acción de recibir
  SHARE = 'share',           // Compartir conocimiento/recursos
  HELP = 'help',             // Ayudar a otros
  COLLABORATE = 'collaborate', // Colaborar en proyectos
  MENTOR = 'mentor',         // Mentoría/enseñanza
  LEARN = 'learn',           // Aprendizaje/recibir mentoría
  CREATE = 'create',         // Crear contenido valioso
  REVIEW = 'review',         // Revisar/evaluar contribuciones
  APPRECIATE = 'appreciate'   // Reconocer/agradecer
}

export enum AyniLevel {
  BEGINNER = 'beginner',     // 0-20: Iniciando en reciprocidad
  GROWING = 'growing',       // 21-40: Creciendo en consciencia
  BALANCED = 'balanced',     // 41-60: Equilibrio básico
  GENEROUS = 'generous',     // 61-80: Generosidad activa
  SAGE = 'sage',            // 81-95: Sabiduría en reciprocidad
  COSMIC = 'cosmic'         // 96-100: Maestría cósmica
}

export class CreateReciprocityEventDto {
  @ApiProperty({ description: 'Tipo de evento de reciprocidad', enum: ReciprocityEventType })
  @IsEnum(ReciprocityEventType)
  eventType: ReciprocityEventType;

  @ApiProperty({ description: 'ID del usuario que ejecuta la acción' })
  @IsNotEmpty()
  @IsString()
  actorId: string;

  @ApiProperty({ description: 'ID del usuario receptor (si aplica)', required: false })
  @IsOptional()
  @IsString()
  recipientId?: string;

  @ApiProperty({ description: 'Magnitud/intensidad de la acción (1-10)', minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  magnitude: number;

  @ApiProperty({ description: 'Contexto donde ocurre la acción (challenge, template, etc.)', required: false })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiProperty({ description: 'ID del recurso relacionado', required: false })
  @IsOptional()
  @IsString()
  resourceId?: string;

  @ApiProperty({ description: 'Descripción detallada del evento', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Metadata adicional del evento', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ReciprocityScoreDto {
  @ApiProperty({ description: 'Score actual de reciprocidad (0-100)' })
  currentScore: number;

  @ApiProperty({ description: 'Nivel de Ayni alcanzado', enum: AyniLevel })
  ayniLevel: AyniLevel;

  @ApiProperty({ description: 'Acciones de dar realizadas' })
  giveActions: number;

  @ApiProperty({ description: 'Acciones de recibir realizadas' })
  receiveActions: number;

  @ApiProperty({ description: 'Ratio de equilibrio (give/receive)' })
  balanceRatio: number;

  @ApiProperty({ description: 'Puntos hacia el siguiente nivel' })
  pointsToNextLevel: number;

  @ApiProperty({ description: 'Bonificación actual de Ünits por reciprocidad (%)' })
  unitsBonus: number;

  @ApiProperty({ description: 'Última actualización del score' })
  lastUpdated: Date;
}

export class ReciprocityRewardDto {
  @ApiProperty({ description: 'Tipo de recompensa calculada' })
  rewardType: 'units_bonus' | 'access_bonus' | 'recognition' | 'cosmic_merit';

  @ApiProperty({ description: 'Cantidad de Ünits bonificadas' })
  unitsAmount: number;

  @ApiProperty({ description: 'Porcentaje de bonificación aplicado' })
  bonusPercentage: number;

  @ApiProperty({ description: 'Mensaje de reconocimiento' })
  message: string;

  @ApiProperty({ description: 'Score de reciprocidad que activó la recompensa' })
  triggerScore: number;

  @ApiProperty({ description: 'Duración de la bonificación en días', required: false })
  durationDays?: number;
}

export class GetReciprocityHistoryDto {
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
    description: 'Filtrar por tipo de evento', 
    required: false,
    enum: ReciprocityEventType 
  })
  @IsOptional()
  @IsEnum(ReciprocityEventType)
  eventType?: ReciprocityEventType;

  @ApiProperty({ description: 'Fecha desde (ISO string)', required: false })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiProperty({ description: 'Fecha hasta (ISO string)', required: false })
  @IsOptional()
  @IsString()
  toDate?: string;
}

export class ReciprocityEventResponseDto {
  @ApiProperty({ description: 'ID único del evento' })
  id: string;

  @ApiProperty({ description: 'Tipo de evento', enum: ReciprocityEventType })
  eventType: ReciprocityEventType;

  @ApiProperty({ description: 'Usuario que ejecutó la acción' })
  actorId: string;

  @ApiProperty({ description: 'Usuario receptor', required: false })
  recipientId?: string;

  @ApiProperty({ description: 'Magnitud del evento' })
  magnitude: number;

  @ApiProperty({ description: 'Puntos de reciprocidad otorgados' })
  pointsAwarded: number;

  @ApiProperty({ description: 'Contexto del evento' })
  context?: string;

  @ApiProperty({ description: 'Descripción del evento' })
  description?: string;

  @ApiProperty({ description: 'Timestamp de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Score de reciprocidad después del evento' })
  newReciprocityScore: number;

  @ApiProperty({ description: 'Recompensa automática activada', required: false })
  automaticReward?: ReciprocityRewardDto;
}