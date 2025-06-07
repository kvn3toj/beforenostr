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

  @ApiProperty({ description: 'The configuration type', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'A description of the configuration setting' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the configuration value is sensitive' })
  @IsBoolean()
  @IsOptional()
  isSensitive?: boolean;
}

export class UpdateConfigDto extends PartialType(CreateConfigDto) {} 