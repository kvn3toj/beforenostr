import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { CreateMundoDto } from './create-mundo.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMundoDto extends PartialType(CreateMundoDto) {
  @ApiProperty({ description: 'Whether the mundo is soft deleted', required: false })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
} 