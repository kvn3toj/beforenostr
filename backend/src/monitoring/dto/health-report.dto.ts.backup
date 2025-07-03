import { ApiProperty } from '@nestjs/swagger';

// --- Sub-interfaces for strong typing in HealthReportDto ---

interface CacheHealth {
  healthy: boolean;
  stats: Record<string, unknown>; // Can be more specific if stats structure is known
}

interface YoutubeApiHealth {
  configured: boolean;
  accessible: boolean;
  lastTest: string;
}

interface PerformanceMetrics {
  averageCalculationTime: number;
  totalCalculations: number;
  cacheHitRatio: number;
  errorRate: number;
  methodDistribution: {
    cache_hit: number;
    youtube_api: number;
    scraping: number;
    estimation: number;
  };
}

interface RecentAlert {
  timestamp: string;
  type: 'CACHE_ERROR' | 'YOUTUBE_API_FAILURE' | 'INCONSISTENCY_DETECTED';
  message: string;
}

interface ProblematicVideo {
  videoId: string;
  issue: string;
  details: Record<string, unknown>;
  id: string;
  title: string;
  storedDuration?: number | null;
  actualDuration?: number | null;
}

// Aligned with usage in notification.service.ts
interface ConsistencyCheck {
  totalVideos: number;
  inconsistenciesFound: number;
  executionTime: number;
}

// Aligned with usage in notification.service.ts
interface ErrorSummary {
  totalErrors: number;
  criticalErrors: number;
}

// This DTO structure now matches the data expected by the NotificationService
export class HealthReportDto {
  @ApiProperty({
    description: 'Overall health status of the system',
    example: 'healthy',
    enum: ['healthy', 'warning', 'critical']
  })
  status: 'healthy' | 'warning' | 'critical';

  @ApiProperty({
    description: 'The time period the report covers (e.g., "daily", "weekly")',
    example: 'daily',
  })
  period: string;

  @ApiProperty({
    description: 'Timestamp of when the report was generated',
    example: '2025-01-29T22:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({ description: 'Consistency check metrics' })
  consistencyCheck: ConsistencyCheck;

  @ApiProperty({ description: 'Performance metrics' })
  performanceMetrics: PerformanceMetrics;

  @ApiProperty({ description: 'Summary of errors' })
  errorSummary: ErrorSummary;

  @ApiProperty({
    description: 'A list of actionable recommendations',
    example: ['Review video processing logs for critical errors.'],
  })
  recommendations: string[];
}

export class ConsistencyCheckResultDto {
  @ApiProperty({
    description: 'Check execution timestamp',
    example: '2025-01-29T22:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Total videos checked',
    example: 100,
  })
  totalVideos: number;

  @ApiProperty({
    description: 'Number of inconsistencies found',
    example: 0,
  })
  inconsistenciesFound: number;

  @ApiProperty({
    description: 'List of videos with issues as JSON array',
    example: [],
  })
  problematicVideos: ProblematicVideo[];

  @ApiProperty({
    description: 'Check execution time in milliseconds',
    example: 1500,
  })
  executionTime: number;

  @ApiProperty({
    description: 'Whether alerts were sent',
    example: false,
  })
  alertsSent: boolean;
}

export class AlertConfigDto {
  @ApiProperty({
    description: 'Enable email alerts',
    example: false,
  })
  emailEnabled: boolean;

  @ApiProperty({
    description: 'Enable Slack alerts',
    example: false,
  })
  slackEnabled: boolean;

  @ApiProperty({
    description: 'Minimum inconsistencies to trigger alert',
    example: 5,
  })
  alertThreshold: number;

  @ApiProperty({
    description: 'Email recipients as JSON array',
    example: ['admin@example.com'],
  })
  emailRecipients: string[];

  @ApiProperty({
    description: 'Slack webhook URL configured',
    example: false,
  })
  slackWebhookConfigured: boolean;
}
