import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', type: String })
  @IsEmail()
  email: string;

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