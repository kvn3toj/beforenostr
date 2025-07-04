import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VideoEngagementMetricsDto {
  @ApiProperty({ 
    description: 'ID del video',
    example: '123'
  })
  videoId: string;

  @ApiProperty({ 
    description: 'Título del video',
    example: 'Introduction to React'
  })
  videoTitle: string;

  @ApiProperty({ 
    description: 'Duración real del video en segundos',
    example: 300
  })
  videoDuration: number;

  @ApiProperty({ 
    description: 'Número total de visualizaciones únicas',
    example: 45
  })
  totalViews: number;

  @ApiProperty({ 
    description: 'Tiempo promedio de visualización en segundos',
    example: 180.5
  })
  averageWatchTime: number;

  @ApiProperty({ 
    description: 'Tasa de completitud como porcentaje (0-100)',
    example: 60.2
  })
  completionRate: number;

  @ApiProperty({ 
    description: 'Puntuación de engagement (métrica compuesta 0-100)',
    example: 75.8
  })
  engagementScore: number;

  @ApiProperty({ 
    description: 'Número total de pausas durante las visualizaciones',
    example: 12
  })
  totalPauses: number;

  @ApiProperty({ 
    description: 'Número total de saltos/seeks durante las visualizaciones',
    example: 8
  })
  totalSeeks: number;

  @ApiProperty({ 
    description: 'Número total de respuestas a preguntas',
    example: 28
  })
  totalQuestionAnswers: number;

  @ApiProperty({ 
    description: 'Porcentaje de respuestas correctas a preguntas (0-100)',
    example: 85.7
  })
  correctAnswerRate: number;

  @ApiPropertyOptional({ 
    description: 'Desglose de eventos por usuario (opcional para reportes detallados)'
  })
  userBreakdown?: Array<{
    userId: string;
    watchTime: number;
    completionRate: number;
    questionsAnswered: number;
    correctAnswers: number;
  }>;
}

export class VideoEngagementReportDto {
  @ApiProperty({ 
    description: 'Rango de fechas del reporte',
    example: {
      startDate: '2025-05-01T00:00:00Z',
      endDate: '2025-05-30T23:59:59Z'
    }
  })
  dateRange: {
    startDate: string;
    endDate: string;
  };

  @ApiProperty({ 
    description: 'Métricas de engagement de los videos',
    type: [VideoEngagementMetricsDto]
  })
  videos: VideoEngagementMetricsDto[];

  @ApiProperty({ 
    description: 'Resumen general del reporte'
  })
  summary: {
    totalVideos: number;
    totalViews: number;
    averageEngagementScore: number;
    averageCompletionRate: number;
    totalWatchTimeHours: number;
  };
} 