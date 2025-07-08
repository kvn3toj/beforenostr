/**
 * 🌌 Cosmic Brain DTOs - Definiciones de tipos para API
 *
 * DTOs (Data Transfer Objects) para el API del AI Cosmic Brain.
 * Incluye documentación Swagger completa y validaciones.
 *
 * Filosofía: Claridad y precisión en la comunicación de datos,
 * reflejando los principios de transparencia de CoomÜnity.
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsDate,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// 🛡️ Guardian Status DTOs
// ============================================================================

export enum GuardianType {
  PHILOSOPHY = 'philosophy',
  ARCHITECTURE = 'architecture',
  UX = 'ux',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
}

export enum GuardianStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ANALYZING = 'analyzing',
  ERROR = 'error',
}

export class GuardianStatusDto {
  @ApiProperty({
    description: 'Tipo de guardián',
    enum: GuardianType,
    example: GuardianType.PHILOSOPHY,
  })
  @IsEnum(GuardianType)
  type: GuardianType;

  @ApiProperty({
    description: 'Estado actual del guardián',
    enum: GuardianStatus,
    example: GuardianStatus.ACTIVE,
  })
  @IsEnum(GuardianStatus)
  status: GuardianStatus;

  @ApiProperty({
    description: 'Puntuación de salud del guardián (0-100)',
    minimum: 0,
    maximum: 100,
    example: 85,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  healthScore: number;

  @ApiProperty({
    description: 'Último análisis realizado',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  lastAnalysis: Date;

  @ApiProperty({
    description: 'Número de problemas críticos detectados',
    minimum: 0,
    example: 2,
  })
  @IsNumber()
  @Min(0)
  criticalIssues: number;

  @ApiProperty({
    description: 'Recomendaciones del guardián',
    type: [String],
    example: ['Mejorar documentación', 'Optimizar rendimiento'],
  })
  @IsArray()
  @IsString({ each: true })
  recommendations: string[];
}

// ============================================================================
// 📊 Philosophy Metrics DTOs
// ============================================================================

export class PhilosophyMetricsDto {
  @ApiProperty({
    description: 'Puntuación de alineación con Bien Común (0-100)',
    minimum: 0,
    maximum: 100,
    example: 92,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  bienComunAlignment: number;

  @ApiProperty({
    description: 'Índice de reciprocidad Ayni (0-100)',
    minimum: 0,
    maximum: 100,
    example: 88,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  ayniIndex: number;

  @ApiProperty({
    description: 'Nivel de cooperación vs competición (0-100)',
    minimum: 0,
    maximum: 100,
    example: 95,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  cooperationLevel: number;

  @ApiProperty({
    description: 'Índice de sostenibilidad (0-100)',
    minimum: 0,
    maximum: 100,
    example: 78,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  sustainabilityIndex: number;

  @ApiProperty({
    description: 'Puntuación general de filosofía (0-100)',
    minimum: 0,
    maximum: 100,
    example: 88,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore: number;

  @ApiProperty({
    description: 'Timestamp de la última evaluación',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  lastEvaluation: Date;
}

// ============================================================================
// 🏥 System Health DTOs
// ============================================================================

export class SystemHealthDto {
  @ApiProperty({
    description: 'Puntuación general de salud del sistema (0-100)',
    minimum: 0,
    maximum: 100,
    example: 87,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  overallHealth: number;

  @ApiProperty({
    description: 'Número de guardianes activos',
    minimum: 0,
    example: 4,
  })
  @IsNumber()
  @Min(0)
  activeGuardians: number;

  @ApiProperty({
    description: 'Total de recomendaciones pendientes',
    minimum: 0,
    example: 7,
  })
  @IsNumber()
  @Min(0)
  totalRecommendations: number;

  @ApiProperty({
    description: 'Problemas críticos que requieren atención',
    minimum: 0,
    example: 1,
  })
  @IsNumber()
  @Min(0)
  criticalIssues: number;

  @ApiProperty({
    description: 'Fecha de la última evolución del sistema',
    example: '2024-01-15T08:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastEvolution?: Date;

  @ApiProperty({
    description: 'Tiempo de actividad del sistema en horas',
    minimum: 0,
    example: 168,
  })
  @IsNumber()
  @Min(0)
  uptime: number;
}

// ============================================================================
// 🎯 Mission DTOs
// ============================================================================

export enum MissionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MissionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class MissionDto {
  @ApiProperty({
    description: 'ID único de la misión',
    example: 'mission-001',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Título de la misión',
    example: 'Optimizar rendimiento del dashboard',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada de la misión',
    example: 'Mejorar el tiempo de carga del dashboard principal',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Estado actual de la misión',
    enum: MissionStatus,
    example: MissionStatus.IN_PROGRESS,
  })
  @IsEnum(MissionStatus)
  status: MissionStatus;

  @ApiProperty({
    description: 'Prioridad de la misión',
    enum: MissionPriority,
    example: MissionPriority.HIGH,
  })
  @IsEnum(MissionPriority)
  priority: MissionPriority;

  @ApiProperty({
    description: 'Guardián asignado a la misión',
    enum: GuardianType,
    example: GuardianType.PERFORMANCE,
  })
  @IsEnum(GuardianType)
  assignedGuardian: GuardianType;

  @ApiProperty({
    description: 'Progreso de la misión (0-100)',
    minimum: 0,
    maximum: 100,
    example: 65,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T09:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha límite estimada',
    example: '2024-01-20T17:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deadline?: Date;
}

// ============================================================================
// 🎵 Harmony Metrics DTOs
// ============================================================================

export class HarmonyMetricsDto {
  @ApiProperty({
    description: 'Puntuación general de armonía del equipo (0-100)',
    minimum: 0,
    maximum: 100,
    example: 89,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  overallHarmony: number;

  @ApiProperty({
    description: 'Nivel de colaboración (0-100)',
    minimum: 0,
    maximum: 100,
    example: 92,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  collaborationLevel: number;

  @ApiProperty({
    description: 'Calidad de comunicación (0-100)',
    minimum: 0,
    maximum: 100,
    example: 85,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  communicationQuality: number;

  @ApiProperty({
    description: 'Índice de bienestar del equipo (0-100)',
    minimum: 0,
    maximum: 100,
    example: 91,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  teamWellbeing: number;

  @ApiProperty({
    description: 'Nivel de estrés del equipo (0-100, menor es mejor)',
    minimum: 0,
    maximum: 100,
    example: 15,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  stressLevel: number;

  @ApiProperty({
    description: 'Timestamp de la última evaluación',
    example: '2024-01-15T11:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  lastEvaluation: Date;
}

// ============================================================================
// 🌌 Main Dashboard DTO
// ============================================================================

export class CosmicDashboardDto {
  @ApiProperty({
    description: 'Estado de todos los guardianes',
    type: [GuardianStatusDto],
  })
  @IsArray()
  @Type(() => GuardianStatusDto)
  guardians: GuardianStatusDto[];

  @ApiProperty({
    description: 'Métricas filosóficas actuales',
    type: PhilosophyMetricsDto,
  })
  @Type(() => PhilosophyMetricsDto)
  philosophyMetrics: PhilosophyMetricsDto;

  @ApiProperty({
    description: 'Estado de salud del sistema',
    type: SystemHealthDto,
  })
  @Type(() => SystemHealthDto)
  systemHealth: SystemHealthDto;

  @ApiProperty({
    description: 'Misiones activas',
    type: [MissionDto],
  })
  @IsArray()
  @Type(() => MissionDto)
  activeMissions: MissionDto[];

  @ApiProperty({
    description: 'Métricas de armonía del equipo',
    type: HarmonyMetricsDto,
  })
  @Type(() => HarmonyMetricsDto)
  harmonyMetrics: HarmonyMetricsDto;

  @ApiProperty({
    description: 'Timestamp de la última actualización',
    example: '2024-01-15T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  lastUpdate: Date;
}

// ============================================================================
// 🔄 Request DTOs
// ============================================================================

export class GetCosmicDataDto {
  @ApiProperty({
    description: 'Incluir datos detallados de guardianes',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeGuardianDetails?: boolean = true;

  @ApiProperty({
    description: 'Incluir métricas de filosofía',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includePhilosophyMetrics?: boolean = true;

  @ApiProperty({
    description: 'Incluir misiones activas',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeActiveMissions?: boolean = true;

  @ApiProperty({
    description: 'Incluir métricas de armonía',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeHarmonyMetrics?: boolean = true;

  @ApiProperty({
    description: 'Filtrar por tipo de guardián específico',
    enum: GuardianType,
    required: false,
  })
  @IsOptional()
  @IsEnum(GuardianType)
  guardianType?: GuardianType;
}
