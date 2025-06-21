import { IsString, IsNotEmpty, IsDate, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChallengeRewardDto } from './create-challenge-reward.dto';
import { ChallengeConfig } from '../types/challenge-config.interface';

export class CreateChallengeDto {
  @ApiProperty({ description: 'The title of the challenge' })
  @IsString()
  @IsNotEmpty()
  title: string;

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

  @ApiProperty({ description: 'The type of the challenge (e.g., AUTOMATED, MANUAL)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Configuration data for the challenge (JSON object)',
    type: 'object',
    example: { "targetValue": 100, "actionType": "complete_video" },
    additionalProperties: true
  })
  @IsObject()
  @IsOptional()
  config?: ChallengeConfig;

  @ApiProperty({ description: 'The status of the challenge (e.g., ACTIVE, INACTIVE)' })
  @IsString()
  @IsOptional()
  status?: string;

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
