import { IsString, IsNotEmpty, IsOptional, IsJSON, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// A general type for AppConfig value - can be refined for specific keys
// For now, allowing any object structure.
export type AppConfigValue = any; // Or a more specific interface if structures are known

export class CreateConfigDto {
  @ApiProperty({ description: 'The configuration key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ 
    description: 'The configuration value (JSONB)', 
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  value: any;

  @ApiProperty({ description: 'The configuration type (SYSTEM, FEATURE, GAMIFICATION_PARAM)', required: true })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UpdateConfigDto extends PartialType(CreateConfigDto) {} 