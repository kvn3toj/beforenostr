import { ApiProperty } from '@nestjs/swagger';

export class CosmicBrainMetricsDto {
  @ApiProperty({
    description: 'System uptime in milliseconds',
    example: 86400000,
    minimum: 0,
  })
  uptime: number;

  @ApiProperty({
    description: 'Total number of evolutions performed',
    example: 42,
    minimum: 0,
  })
  evolutionsCount: number;

  @ApiProperty({
    description: 'Total number of predictions made',
    example: 156,
    minimum: 0,
  })
  predictionsCount: number;

  @ApiProperty({
    description: 'Total number of missions assigned',
    example: 28,
    minimum: 0,
  })
  missionsCount: number;

  @ApiProperty({
    description: 'Total number of harmony analyses performed',
    example: 89,
    minimum: 0,
  })
  harmonyAnalysesCount: number;

  @ApiProperty({
    description: 'Average harmony score over time',
    example: 87.5,
    minimum: 0,
    maximum: 100,
  })
  averageHarmony: number;

  @ApiProperty({
    description: 'Average philosophy alignment score over time',
    example: 91.2,
    minimum: 0,
    maximum: 100,
  })
  averagePhilosophyAlignment: number;

  @ApiProperty({
    description: 'Timestamp of last metrics update',
    example: '2025-01-10T10:30:00Z',
  })
  lastUpdate: Date;
}
