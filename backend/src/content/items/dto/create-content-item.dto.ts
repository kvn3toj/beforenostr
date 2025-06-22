import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateContentItemDto {
  @ApiProperty({ description: 'Título del contenido' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción del contenido', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Contenido del item' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'ID de la playlist' })
  @IsString()
  playlistId: string;

  @ApiProperty({ description: 'ID del tipo de item' })
  @IsString()
  itemTypeId: string;

  @ApiProperty({ description: 'Orden del item en la playlist', required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ description: 'Si el item está activo', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
