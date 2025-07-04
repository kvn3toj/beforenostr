import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTOs para las respuestas del sistema de STAGES
 * Purificación alquímica de SAGE: eliminando 'any' por tipos explícitos
 * Customer Journey: BUYER → SEEKER → SOLVER → PROMOTER
 */

export enum StageType {
  BUYER = 'BUYER',
  SEEKER = 'SEEKER',
  SOLVER = 'SOLVER',
  PROMOTER = 'PROMOTER',
}

export enum ProgressionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  LOCKED = 'locked',
}

export class StageMetricsDto {
  @ApiProperty({
    description: 'Total de usuarios en este stage',
    example: 150,
  })
  totalUsers: number;

  @ApiProperty({
    description: 'Usuarios activos en los últimos 30 días',
    example: 45,
  })
  activeUsers: number;

  @ApiProperty({
    description: 'Tasa de conversión al siguiente stage (%)',
    example: 25.5,
  })
  conversionRate: number;

  @ApiProperty({
    description: 'Tiempo promedio en este stage (días)',
    example: 14.2,
  })
  averageTimeInStage: number;

  @ApiProperty({
    description: 'Score promedio de satisfacción (1-10)',
    example: 8.3,
  })
  satisfactionScore: number;
}

export class StageConfigurationDto {
  @ApiProperty({
    description: 'ID del stage',
    example: 'stage-seeker',
  })
  id: string;

  @ApiProperty({
    description: 'Tipo de stage',
    enum: StageType,
    example: StageType.SEEKER,
  })
  type: StageType;

  @ApiProperty({
    description: 'Nombre del stage',
    example: 'Buscador de Sabiduría',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del stage',
    example: 'Etapa donde los usuarios exploran y buscan conocimiento',
  })
  description: string;

  @ApiProperty({
    description: 'Orden del stage en el customer journey',
    example: 2,
  })
  order: number;

  @ApiProperty({
    description: 'Requisitos para acceder a este stage',
    type: [String],
    example: ['complete_onboarding', 'watch_intro_video'],
  })
  requirements: string[];

  @ApiProperty({
    description: 'Objetivos de este stage',
    type: [String],
    example: ['engage_with_content', 'complete_first_quest'],
  })
  objectives: string[];

  @ApiProperty({
    description: 'Recompensas disponibles en este stage',
    type: 'object',
    additionalProperties: true,
    example: {
      points: 100,
      badges: ['seeker_badge'],
      unlocks: ['premium_content'],
    },
  })
  rewards: Record<string, unknown>;

  @ApiProperty({
    description: 'Si este stage está activo',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Métricas del stage',
    type: StageMetricsDto,
  })
  metrics?: StageMetricsDto;
}

export class UserProgressionDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Stage actual del usuario',
    enum: StageType,
    example: StageType.SEEKER,
  })
  currentStage: StageType;

  @ApiProperty({
    description: 'Estado de progresión en el stage actual',
    enum: ProgressionStatus,
    example: ProgressionStatus.IN_PROGRESS,
  })
  status: ProgressionStatus;

  @ApiProperty({
    description: 'Porcentaje de completitud del stage actual (0-100)',
    example: 65.5,
  })
  progressPercentage: number;

  @ApiProperty({
    description: 'Fecha de entrada al stage actual',
    example: '2024-01-15T10:30:00Z',
  })
  enteredAt: string;

  @ApiPropertyOptional({
    description: 'Fecha de completitud del stage (si aplica)',
    example: '2024-01-25T14:20:00Z',
  })
  completedAt?: string;

  @ApiProperty({
    description: 'Objetivos completados en el stage actual',
    type: [String],
    example: ['watch_intro_video', 'complete_profile'],
  })
  completedObjectives: string[];

  @ApiProperty({
    description: 'Objetivos pendientes en el stage actual',
    type: [String],
    example: ['engage_with_community', 'complete_first_quest'],
  })
  pendingObjectives: string[];

  @ApiProperty({
    description: 'Puntos ganados en el stage actual',
    example: 75,
  })
  pointsEarned: number;

  @ApiProperty({
    description: 'Badges desbloqueados en el stage actual',
    type: [String],
    example: ['newcomer', 'first_steps'],
  })
  unlockedBadges: string[];

  @ApiProperty({
    description: 'Si el usuario puede progresar al siguiente stage',
    example: false,
  })
  canProgress: boolean;

  @ApiPropertyOptional({
    description: 'Siguiente stage disponible',
    enum: StageType,
    example: StageType.SOLVER,
  })
  nextStage?: StageType;
}

export class StageAnalyticsDto {
  @ApiProperty({
    description: 'Información del stage',
    type: StageConfigurationDto,
  })
  stage: StageConfigurationDto;

  @ApiProperty({
    description: 'Métricas detalladas',
    type: StageMetricsDto,
  })
  metrics: StageMetricsDto;

  @ApiProperty({
    description: 'Datos de conversión por período',
    type: 'object',
    additionalProperties: true,
    example: {
      daily: [
        { date: '2024-01-01', conversions: 5 },
        { date: '2024-01-02', conversions: 8 },
      ],
      weekly: [
        { week: '2024-W01', conversions: 25 },
        { week: '2024-W02', conversions: 32 },
      ],
    },
  })
  conversionData: Record<string, unknown>;

  @ApiProperty({
    description: 'Top objetivos completados',
    type: 'array',
    example: [
      { objective: 'watch_intro_video', completions: 120 },
      { objective: 'complete_profile', completions: 95 },
    ],
  })
  topObjectives: Array<{
    objective: string;
    completions: number;
  }>;

  @ApiProperty({
    description: 'Distribución de tiempo en el stage',
    type: 'object',
    additionalProperties: true,
    example: {
      average: 14.2,
      median: 12.0,
      percentiles: {
        p25: 8.5,
        p75: 18.0,
        p90: 25.5,
      },
    },
  })
  timeDistribution: Record<string, unknown>;
}

export class ProgressActionResultDto {
  @ApiProperty({
    description: 'Si la acción fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje de resultado',
    example: 'Usuario progresado exitosamente al stage SOLVER',
  })
  message: string;

  @ApiProperty({
    description: 'Estado de progresión actualizado del usuario',
    type: UserProgressionDto,
  })
  userProgression: UserProgressionDto;

  @ApiPropertyOptional({
    description: 'Recompensas otorgadas por la progresión',
    type: 'object',
    additionalProperties: true,
    example: {
      points: 150,
      badges: ['solver_unlock'],
      unlocks: ['advanced_quests'],
    },
  })
  rewards?: Record<string, unknown>;
}
