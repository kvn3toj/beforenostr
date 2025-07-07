import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '../../generated/prisma';

export class MissionResponseDto {
  @ApiProperty({
    description: 'Indica si la misión fue despachada exitosamente',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'ID único de la misión generado por N8N',
    example: 'mission_1234567890',
  })
  missionId?: string;

  @ApiProperty({
    description: 'Estado actual de la misión',
    enum: $Enums.MissionStatus,
    example: $Enums.MissionStatus.DISPATCHED,
  })
  status: $Enums.MissionStatus;

  @ApiProperty({
    description: 'Mensaje descriptivo del resultado',
    example:
      'Misión despachada exitosamente a ANA para coordinación de agentes',
  })
  message: string;

  @ApiProperty({
    description: 'Datos de respuesta de N8N',
    required: false,
  })
  data?: Record<string, unknown>;

  @ApiProperty({
    description: 'Timestamp de cuando fue despachada la misión',
    example: '2025-01-13T10:30:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Agentes involucrados en la misión',
    example: ['ana', 'nira', 'aria'],
    required: false,
  })
  involvedAgents?: string[];

  @ApiProperty({
    description: 'Tiempo estimado de completación en minutos',
    example: 15,
    required: false,
  })
  estimatedCompletionTime?: number;

  @ApiProperty({
    description: 'URL del webhook para seguimiento de la misión',
    example: 'https://tu-dominio.com/webhook/mission/1234567890',
    required: false,
  })
  trackingUrl?: string;
}
