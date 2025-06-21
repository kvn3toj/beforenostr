import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl, IsNumber, IsUUID } from 'class-validator';

export class CreateMeritDto {
  @ApiProperty({ description: 'User ID who earned the merit' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Merit amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Type of merit' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Source of the merit' })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ description: 'Related entity ID', required: false })
  @IsOptional()
  @IsString()
  relatedEntityId?: string;
}
