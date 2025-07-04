import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStageDto {
  @ApiProperty({ description: 'The name of the stage.' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The description of the stage.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the stage is currently active.' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
