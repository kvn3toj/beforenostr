import { IsInt, IsNotEmpty, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeRewardDto {
  @ApiProperty({ description: 'The amount of merits to reward' })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  meritAmount: number;

  @ApiProperty({ description: 'A description for the reward' })
  @IsString()
  @IsOptional()
  description?: string;
} 