import { IsString, IsOptional, IsObject, IsUUID, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum VideoEventType {
  VIDEO_START = 'video_start',
  VIDEO_PAUSE = 'video_pause',
  VIDEO_RESUME = 'video_resume',
  VIDEO_SEEK = 'video_seek',
  VIDEO_COMPLETE = 'video_complete',
  VIDEO_ABANDON = 'video_abandon',
  QUESTION_ANSWERED = 'question_answered',
  TOTAL_WATCH_TIME = 'total_watch_time'
}

export class CreateVideoEngagementEventDto {
  @ApiProperty({ 
    description: 'Tipo de evento de video', 
    enum: VideoEventType 
  })
  @IsEnum(VideoEventType)
  eventType: VideoEventType;

  @ApiProperty({ description: 'ID del usuario que generó el evento' })
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID del video item' })
  @IsString()
  videoItemId: string;

  @ApiPropertyOptional({ description: 'ID de la playlist relacionada' })
  @IsOptional()
  @IsString()
  playlistId?: string;

  @ApiPropertyOptional({ description: 'ID del mundo relacionado' })
  @IsOptional()
  @IsString()
  mundoId?: string;

  @ApiProperty({ description: 'ID de sesión para agrupar eventos' })
  @IsString()
  sessionId: string;

  @ApiPropertyOptional({ 
    description: 'Timestamp específico del evento en el video (en segundos)', 
    example: 45.5 
  })
  @IsOptional()
  @IsNumber()
  videoTimestamp?: number;

  @ApiPropertyOptional({ 
    description: 'Duración total del video (en segundos)', 
    example: 300 
  })
  @IsOptional()
  @IsNumber()
  videoDuration?: number;

  @ApiPropertyOptional({ 
    description: 'Tiempo total de visualización en esta sesión (en segundos)', 
    example: 120 
  })
  @IsOptional()
  @IsNumber()
  totalWatchTime?: number;

  @ApiPropertyOptional({ 
    description: 'Metadatos adicionales del evento',
    example: {
      device: 'mobile',
      quality: '720p',
      previousTimestamp: 30,
      newTimestamp: 60,
      questionId: 'q123',
      answerCorrect: true
    }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
} 