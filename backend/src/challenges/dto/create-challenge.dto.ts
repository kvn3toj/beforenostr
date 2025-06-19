import { IsString, IsNotEmpty, IsDate, IsOptional, IsJSON, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChallengeRewardDto } from './create-challenge-reward.dto';
import { ChallengeConfig } from '../types/challenge-config.interface';

enum ChallengeType {
  CUSTOM = 'CUSTOM',
  AUTOMATED = 'AUTOMATED',
}

enum ChallengeStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateChallengeDto {
  @ApiProperty({ description: 'The name of the challenge' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A unique slug for the challenge' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'The description of the challenge' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The type of the challenge', enum: ChallengeType })
  @IsEnum(ChallengeType)
  @IsNotEmpty()
  type: ChallengeType;

  @ApiProperty({ description: 'Configuration data for the challenge (JSONB)', type: 'object' })
  @IsOptional()
  config?: ChallengeConfig;

  @ApiProperty({ description: 'The status of the challenge', enum: ChallengeStatus })
  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus;

  @ApiProperty({ description: 'The start date of the challenge' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'The end date of the challenge' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'The ID of the user who created the challenge' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({ description: 'Rewards for completing the challenge', type: () => [CreateChallengeRewardDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateChallengeRewardDto)
  rewards?: CreateChallengeRewardDto[];
} 