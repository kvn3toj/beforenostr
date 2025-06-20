import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Juan Pérez', required: false, type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false, type: String })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ example: true, required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 