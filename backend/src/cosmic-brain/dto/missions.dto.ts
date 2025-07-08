import { ApiProperty } from '@nestjs/swagger';

export class MissionDto {
  @ApiProperty({
    description: 'Unique identifier for the mission',
    example: 'mission-001',
  })
  id: string;

  @ApiProperty({
    description: 'Mission title',
    example: 'Implement user authentication',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the mission',
    example: 'Implement JWT-based authentication system for the backend API',
  })
  description: string;

  @ApiProperty({
    description: 'Mission priority level',
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  })
  priority: string;

  @ApiProperty({
    description: 'Mission category',
    example: 'TECHNICAL',
    enum: ['TECHNICAL', 'PHILOSOPHY', 'COLLABORATION', 'INNOVATION'],
  })
  category: string;

  @ApiProperty({
    description: 'Current status of the mission',
    example: 'IN_PROGRESS',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'],
  })
  status: string;

  @ApiProperty({
    description: 'Mission progress percentage',
    example: 65,
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @ApiProperty({
    description: 'Estimated completion date',
    example: '2025-01-15T10:00:00Z',
  })
  estimatedCompletion: Date;

  @ApiProperty({
    description: 'Mission creation timestamp',
    example: '2025-01-10T10:00:00Z',
  })
  createdAt: Date;
}

export class CosmicBrainMissionsDto {
  @ApiProperty({
    description: 'List of active missions',
    type: [MissionDto],
  })
  activeMissions: MissionDto[];

  @ApiProperty({
    description: 'Total number of missions',
    example: 15,
    minimum: 0,
  })
  totalMissions: number;

  @ApiProperty({
    description: 'Number of completed missions',
    example: 8,
    minimum: 0,
  })
  completedMissions: number;

  @ApiProperty({
    description: 'Number of pending missions',
    example: 5,
    minimum: 0,
  })
  pendingMissions: number;

  @ApiProperty({
    description: 'Number of blocked missions',
    example: 2,
    minimum: 0,
  })
  blockedMissions: number;
}
