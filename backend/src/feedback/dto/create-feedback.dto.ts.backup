import {
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  IsObject,
  IsArray,
  IsInt,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class TechnicalContextDto {
  @ApiProperty()
  @IsString()
  userAgent: string;

  @ApiProperty()
  @IsString()
  screenResolution: string;

  @ApiProperty()
  @IsString()
  viewport: string;

  @ApiProperty()
  @IsString()
  timestamp: string;
}

// Enum local hasta que se genere el cliente de Prisma con la nueva migración
export enum FeedbackType {
  BUG = 'BUG',
  IMPROVEMENT = 'IMPROVEMENT',
  MISSING_FEATURE = 'MISSING_FEATURE',
  UI_UX = 'UI_UX',
  PERFORMANCE = 'PERFORMANCE',
  OTHER = 'OTHER',
}

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'URL de la página donde se detectó el feedback',
    example: 'http://localhost:3001/uplay/video/123',
  })
  @IsUrl({}, { message: 'pageUrl debe ser una URL válida' })
  pageUrl: string;

  @ApiProperty({
    description: 'Texto del feedback capturado por el Oráculo',
    example: 'El botón de play no responde cuando el video ya está cargado',
  })
  @IsString({ message: 'feedbackText debe ser un string' })
  feedbackText: string;

  @ApiProperty({
    description: 'Tipo de feedback identificado por el Oráculo',
    enum: FeedbackType,
    example: FeedbackType.BUG,
  })
  @IsEnum(FeedbackType, {
    message: 'feedbackType debe ser un valor válido del enum FeedbackType',
  })
  feedbackType: FeedbackType;

  @ApiPropertyOptional({
    description: 'Contexto del componente React donde se detectó el feedback',
    example: 'VideoPlayer -> PlayButton component',
  })
  @IsString()
  @IsOptional()
  componentContext?: string;

  @ApiPropertyOptional({
    description:
      'Contexto técnico capturado por el Oráculo (userAgent, resolución, etc.)',
    example: {
      userAgent: 'Mozilla/5.0...',
      screenResolution: '1920x1080',
      viewport: '1600x900',
      timestamp: '2025-06-20T12:35:00Z',
    },
    type: TechnicalContextDto,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => TechnicalContextDto)
  technicalContext?: TechnicalContextDto;

  @ApiPropertyOptional({
    description: 'Nivel de prioridad del feedback (0-5)',
    minimum: 0,
    maximum: 5,
    example: 3,
  })
  @IsInt()
  @Min(0)
  @Max(5)
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({
    description: 'Tags para categorización avanzada del feedback',
    example: ['video-player', 'user-experience', 'critical'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
