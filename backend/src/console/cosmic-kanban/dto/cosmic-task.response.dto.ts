import { ApiProperty } from '@nestjs/swagger';
import {
  ThematicElement,
  GuardianRole,
  HambrELevel,
  ColumnStatus,
  TaskPriority,
  PhilosophicalKpi,
} from './create-cosmic-task.dto';

export class CosmicTaskResponseDto {
  @ApiProperty({
    description: 'ID único de la tarea cósmica',
    example: 'cosmic-task-123',
  })
  id: string;

  @ApiProperty({
    description: 'Título de la tarea cósmica',
    example: 'Encender la Puerta al Viaje del Peregrino',
  })
  title: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarea',
    example:
      'Transformar la experiencia de onboarding inicial para nuevos Jugadores',
  })
  description: string;

  @ApiProperty({
    description: 'Elemento temático cósmico asociado',
    enum: ThematicElement,
    example: ThematicElement.ETHER,
  })
  element: ThematicElement;

  @ApiProperty({
    description: 'Guardián digital responsable',
    enum: GuardianRole,
    example: GuardianRole.ANA,
  })
  guardian: GuardianRole;

  @ApiProperty({
    description: 'Nivel de HambrE',
    enum: HambrELevel,
    example: HambrELevel.IMPULSES_TRANSFORMATION,
  })
  hambreLevel: HambrELevel;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    enum: TaskPriority,
    example: TaskPriority.CRITICAL,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Fase del proyecto',
    example: 1,
  })
  phase: 1 | 2 | 3;

  @ApiProperty({
    description: 'Horas estimadas',
    example: 8,
  })
  estimatedHours: number;

  @ApiProperty({
    description: 'KPI filosófico',
    enum: PhilosophicalKpi,
    example: PhilosophicalKpi.VIC,
  })
  philosophicalKpi: PhilosophicalKpi;

  @ApiProperty({
    description: 'Etiquetas',
    type: [String],
    example: ['Onboarding', 'PilgrimJourney'],
  })
  tags: string[];

  @ApiProperty({
    description: 'Estado actual',
    enum: ColumnStatus,
    example: ColumnStatus.BACKLOG,
  })
  status: ColumnStatus;

  @ApiProperty({
    description: 'Persona asignada',
    required: false,
    example: 'ANA (Chief Innovation Officer)',
  })
  assignee?: string;

  @ApiProperty({
    description: 'Horas reales trabajadas',
    required: false,
    example: 6.5,
  })
  actualHours?: number;

  @ApiProperty({
    description: 'Fecha de finalización',
    required: false,
    example: '2025-01-15T10:30:00Z',
  })
  completionDate?: Date;

  @ApiProperty({
    description: 'Metadatos adicionales',
    required: false,
  })
  metadata?: any;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-10T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-10T10:00:00Z',
  })
  updatedAt: Date;
}
