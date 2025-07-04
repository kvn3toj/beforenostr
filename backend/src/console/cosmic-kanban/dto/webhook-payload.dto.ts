import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

/**
 * DTOs para webhooks del Portal Kanban Cósmico
 * Purificación alquímica de SAGE: eliminando 'any' por tipos explícitos
 */

export enum WebhookEventType {
  CODE_PUSH = 'code_push',
  PULL_REQUEST_MERGED = 'pull_request_merged',
  DEPLOYMENT_SUCCESS = 'deployment_success',
  DEPLOYMENT_FAILED = 'deployment_failed',
  BUILD_SUCCESS = 'build_success',
  BUILD_FAILED = 'build_failed',
  CUSTOM_EVENT = 'custom_event',
}

/**
 * Metadatos de webhook específicos para diferentes tipos de eventos
 */
interface WebhookMetadata {
  /** Información del repositorio para eventos de código */
  repository?: {
    name: string;
    url: string;
    branch?: string;
    commit?: string;
  };
  /** Información de build/deploy para eventos de CI/CD */
  build?: {
    id: string;
    status: 'success' | 'failed' | 'pending';
    url?: string;
    duration?: number;
  };
  /** Usuario que triggeró el evento */
  triggeredBy?: {
    username: string;
    email?: string;
  };
  /** Timestamp del evento */
  timestamp?: string;
  /** Información adicional específica del sistema */
  source?: 'github' | 'gitlab' | 'vercel' | 'render' | 'other';
  [key: string]: unknown;
}

export class WebhookPayloadDto {
  @ApiProperty({
    description: 'Tipo de evento del webhook',
    enum: WebhookEventType,
    example: WebhookEventType.CODE_PUSH,
  })
  @IsEnum(WebhookEventType)
  event: WebhookEventType;

  @ApiPropertyOptional({
    description: 'Mensaje descriptivo del evento',
    example: 'Push to main branch detected',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Metadatos específicos del evento',
    type: 'object',
    additionalProperties: true,
    example: {
      repository: {
        name: 'coomunity-superapp',
        url: 'https://github.com/org/coomunity',
        branch: 'main',
        commit: 'abc123',
      },
      triggeredBy: {
        username: 'developer',
        email: 'dev@coomunity.com',
      },
      source: 'github',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: WebhookMetadata;

  @ApiPropertyOptional({
    description: 'Datos adicionales del payload original del webhook',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  rawData?: Record<string, unknown>;
}
