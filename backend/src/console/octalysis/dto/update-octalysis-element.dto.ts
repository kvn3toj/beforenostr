import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOctalysisElementDto {
  @ApiProperty({ description: 'The name of the Octalysis element.' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The description of the Octalysis element.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The weight or value of the element.' })
  @IsNumber()
  @IsOptional()
  weight?: number;
}
