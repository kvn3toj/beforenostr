import { IsString, IsOptional, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalyticsDataDto {
  @ApiProperty({ description: 'Tipo de evento analytics' })
  @IsString()
  eventType: string;

  @ApiProperty({ description: 'ID del usuario que generó el evento' })
  @IsString()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: 'ID del video item relacionado' })
  @IsOptional()
  @IsString()
  videoItemId?: string;

  @ApiPropertyOptional({ description: 'ID de la playlist relacionada' })
  @IsOptional()
  @IsString()
  playlistId?: string;

  @ApiPropertyOptional({ description: 'ID del mundo relacionado' })
  @IsOptional()
  @IsString()
  mundoId?: string;

  @ApiPropertyOptional({ description: 'ID de sesión' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ 
    description: 'Metadatos adicionales del evento',
    example: {
      duration: 120,
      position: 45,
      device: 'mobile'
    }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
} 