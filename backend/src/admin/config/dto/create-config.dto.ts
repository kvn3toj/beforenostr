import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// A general type for configuration value
export type AppConfigValue = string | number | boolean | object | null;

export class CreateConfigDto {
  @ApiProperty({ description: 'The unique key for the configuration setting' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'The configuration value as string' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({
    description:
      'The type of configuration (e.g., string, number, boolean, json)',
  })
  @IsString()
  @IsOptional()
  type?: string;
}

export class UpdateConfigDto extends PartialType(CreateConfigDto) {}
