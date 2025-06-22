import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePersonalityDto {
  @ApiProperty({ description: 'Nombre único de la personalidad' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción de la personalidad' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Características de personalidad en formato JSON',
    example: {
      openness: 0.8,
      conscientiousness: 0.6,
      extraversion: 0.7,
      agreeableness: 0.9,
      neuroticism: 0.3,
      traits: ['creative', 'analytical', 'collaborative'],
    },
  })
  @IsObject()
  traits: Record<string, any>;
}
