import { IsEnum, IsOptional, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum UserChallengeStatus {
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class UpdateUserChallengeDto {
  @ApiProperty({ description: 'The status of the user challenge', enum: UserChallengeStatus })
  @IsEnum(UserChallengeStatus)
  @IsOptional()
  status?: UserChallengeStatus;

  @ApiProperty({ description: 'Progress data for the user challenge (JSONB)', type: 'object' })
  @IsJSON()
  @IsOptional()
  progress?: any;
} 