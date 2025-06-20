import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateItemTypeDto {
  @ApiProperty({ description: 'The name of the item type' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A brief description of the item type', required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 