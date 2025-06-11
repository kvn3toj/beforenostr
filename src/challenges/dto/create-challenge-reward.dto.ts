import { IsInt, IsNotEmpty, IsString, IsOptional, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeRewardDto {
  @ApiProperty({ description: 'Type of reward (MERITS, UNITS, TOKENS, BADGE)', enum: ['MERITS', 'UNITS', 'TOKENS', 'BADGE'], default: 'MERITS' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'The amount to reward (for numeric rewards)' })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ description: 'The amount of merits to reward (legacy)' })
  @IsInt()
  @IsOptional()
  @Min(1)
  meritAmount?: number;

  @ApiProperty({ description: 'A description for the reward' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Additional metadata for the reward' })
  @IsOptional()
  metadata?: any;
} 