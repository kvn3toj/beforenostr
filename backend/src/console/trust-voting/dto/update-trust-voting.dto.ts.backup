import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrustVotingDto {
  @ApiProperty({ description: 'The mechanism used for validation.' })
  @IsString()
  @IsOptional()
  validationMechanism?: string;

  @ApiProperty({ description: 'The threshold required for a successful vote.' })
  @IsNumber()
  @IsOptional()
  votingThreshold?: number;
}
