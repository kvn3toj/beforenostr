import { ApiProperty } from '@nestjs/swagger';

export class CosmicBrainStatusDto {
  @ApiProperty({
    description: 'Overall harmony score of the system',
    example: 85.5,
    minimum: 0,
    maximum: 100,
  })
  harmony: number;

  @ApiProperty({
    description: 'Philosophy alignment score',
    example: 92.3,
    minimum: 0,
    maximum: 100,
  })
  alignment: number;

  @ApiProperty({
    description: 'Number of active alerts in the system',
    example: 2,
    minimum: 0,
  })
  activeAlerts: number;

  @ApiProperty({
    description: 'System health percentage',
    example: 95.0,
    minimum: 0,
    maximum: 100,
  })
  systemHealth: number;

  @ApiProperty({
    description: 'Last evolution timestamp',
    example: '2025-01-10T10:30:00Z',
  })
  lastEvolution: Date;
}
