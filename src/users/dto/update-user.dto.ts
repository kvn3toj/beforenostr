import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEmail, IsUUID, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Juan Pérez', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'juan@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Juan', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Pérez', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'juanperez', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Colombia', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Calle 123 #45-67', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'ACTIVE', required: false, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

  @ApiProperty({ example: '4d5c2a5a-d36f-4345-a6b2-34e3ce379437', required: false })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiProperty({ example: '4d5c2a5a-d36f-4345-a6b2-34e3ce379437', required: false })
  @IsOptional()
  @IsUUID()
  personalityId?: string;
} 