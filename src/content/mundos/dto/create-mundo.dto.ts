import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreateMundoDto {
  @ApiProperty({ description: 'The name of the mundo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A brief description of the mundo', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The slug for the mundo (unique identifier in URL)' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'URL of the mundo thumbnail/image', required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Whether the mundo is active', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 