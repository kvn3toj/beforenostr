import { ApiProperty } from '@nestjs/swagger';

export class HealthReportDto {
  @ApiProperty({ 
    description: 'Overall system health status',
    example: 'healthy'
  })
  status: string;

  @ApiProperty({ 
    description: 'Timestamp of the report',
    example: '2025-01-29T22:00:00.000Z'
  })
  timestamp: string;

  @ApiProperty({ 
    description: 'Last consistency check date',
    example: '2025-01-29T21:00:00.000Z',
    nullable: true
  })
  lastConsistencyCheck: string | null;

  @ApiProperty({ 
    description: 'Number of inconsistencies found in last check',
    example: 0
  })
  inconsistenciesCount: number;

  @ApiProperty({ 
    description: 'Redis cache health status as JSON object',
    example: { healthy: true, stats: {} }
  })
  cacheHealth: any;

  @ApiProperty({ 
    description: 'YouTube API connectivity status as JSON object',
    example: { configured: true, accessible: true, lastTest: '2025-01-29T21:00:00.000Z' }
  })
  youtubeApiHealth: any;

  @ApiProperty({ 
    description: 'Performance metrics as JSON object',
    example: { averageDurationCalculationTime: 150, cacheHitRatio: 0.85, totalVideosProcessed: 100 }
  })
  performanceMetrics: any;

  @ApiProperty({ 
    description: 'Recent alerts sent as JSON array',
    example: []
  })
  recentAlerts: any[];
}

export class ConsistencyCheckResultDto {
  @ApiProperty({ 
    description: 'Check execution timestamp',
    example: '2025-01-29T22:00:00.000Z'
  })
  timestamp: string;

  @ApiProperty({ 
    description: 'Total videos checked',
    example: 100
  })
  totalVideos: number;

  @ApiProperty({ 
    description: 'Number of inconsistencies found',
    example: 0
  })
  inconsistenciesFound: number;

  @ApiProperty({ 
    description: 'List of videos with issues as JSON array',
    example: []
  })
  problematicVideos: any[];

  @ApiProperty({ 
    description: 'Check execution time in milliseconds',
    example: 1500
  })
  executionTime: number;

  @ApiProperty({ 
    description: 'Whether alerts were sent',
    example: false
  })
  alertsSent: boolean;
}

export class AlertConfigDto {
  @ApiProperty({ 
    description: 'Enable email alerts',
    example: false
  })
  emailEnabled: boolean;

  @ApiProperty({ 
    description: 'Enable Slack alerts',
    example: false
  })
  slackEnabled: boolean;

  @ApiProperty({ 
    description: 'Minimum inconsistencies to trigger alert',
    example: 5
  })
  alertThreshold: number;

  @ApiProperty({ 
    description: 'Email recipients as JSON array',
    example: ['admin@example.com']
  })
  emailRecipients: string[];

  @ApiProperty({ 
    description: 'Slack webhook URL configured',
    example: false
  })
  slackWebhookConfigured: boolean;
} 