import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ThematicElement {
  FIRE = 'Fuego',
  WATER = 'Agua',
  AIR = 'Aire',
  EARTH = 'Tierra',
  ETHER = 'Éter',
}

export enum GuardianRole {
  ANA = 'ANA',
  LUNA = 'LUNA',
  ARIA = 'ARIA',
  PHOENIX = 'PHOENIX',
  KIRA = 'KIRA',
  SAGE = 'SAGE',
  NIRA = 'NIRA',
  COSMOS = 'COSMOS',
  MAYA = 'MAYA',
  ZARA = 'ZARA',
  THOR = 'THOR',
  NOVA = 'NOVA',
}

export enum HambrELevel {
  NURTURES_CURIOSITY = 1,
  ACTIVATES_CONTRIBUTION = 2,
  IMPULSES_TRANSFORMATION = 3,
}

export enum ColumnStatus {
  BACKLOG = 'Backlog Cósmico',
  ALCHEMICAL = 'En Proceso de Alquimia',
  QUALITY = 'En Revisión de Calidad',
  MANIFESTED = 'Manifestado',
}

export enum TaskPriority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum PhilosophicalKpi {
  IER = 'IER',
  VIC = 'VIC',
  GS = 'GS',
}

export class CreateCosmicTaskDto {
  @ApiProperty({
    description: 'Título de la tarea cósmica',
    example: 'Encender la Puerta al Viaje del Peregrino',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarea',
    example:
      'Transformar la experiencia de onboarding inicial para nuevos Jugadores',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Elemento temático cósmico asociado',
    enum: ThematicElement,
    example: ThematicElement.ETHER,
  })
  @IsEnum(ThematicElement)
  element: ThematicElement;

  @ApiProperty({
    description: 'Guardián digital responsable',
    enum: GuardianRole,
    example: GuardianRole.ANA,
  })
  @IsEnum(GuardianRole)
  guardian: GuardianRole;

  @ApiProperty({
    description:
      'Nivel de HambrE (Hunger for Action, Motivation, Responsibility, Excellence)',
    enum: HambrELevel,
    example: HambrELevel.IMPULSES_TRANSFORMATION,
  })
  @IsEnum(HambrELevel)
  hambreLevel: HambrELevel;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    enum: TaskPriority,
    example: TaskPriority.CRITICAL,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    description: 'Fase del proyecto (1, 2, o 3)',
    minimum: 1,
    maximum: 3,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Max(3)
  phase: 1 | 2 | 3;

  @ApiProperty({
    description: 'Horas estimadas para completar la tarea',
    minimum: 0,
    example: 8,
  })
  @IsNumber()
  @Min(0)
  estimatedHours: number;

  @ApiProperty({
    description: 'KPI filosófico principal',
    enum: PhilosophicalKpi,
    example: PhilosophicalKpi.VIC,
  })
  @IsEnum(PhilosophicalKpi)
  philosophicalKpi: PhilosophicalKpi;

  @ApiProperty({
    description: 'Etiquetas para categorización',
    type: [String],
    example: ['Onboarding', 'PilgrimJourney', 'CosmicDesign'],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'Estado actual de la tarea',
    enum: ColumnStatus,
    example: ColumnStatus.BACKLOG,
  })
  @IsEnum(ColumnStatus)
  status: ColumnStatus;

  @ApiProperty({
    description: 'Persona asignada (opcional)',
    required: false,
    example: 'ANA (Chief Innovation Officer)',
  })
  @IsOptional()
  @IsString()
  assignee?: string;

  @ApiProperty({
    description: 'Horas reales trabajadas (opcional)',
    required: false,
    minimum: 0,
    example: 6.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualHours?: number;

  @ApiProperty({
    description: 'Fecha de finalización (opcional)',
    required: false,
    example: '2025-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @ApiProperty({
    description: 'Metadatos adicionales en formato JSON (opcional)',
    required: false,
    example: { projectType: 'infrastructure', realWorldImpact: 'high' },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
