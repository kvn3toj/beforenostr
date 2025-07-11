import { IsString, IsOptional, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ description: 'Nombre del reporte' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Tipo de reporte' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Descripción del reporte' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Datos del reporte',
    example: {
      totalUsers: 100,
      totalPlaylists: 50,
      metrics: []
    }
  })
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({ description: 'ID del usuario que generó el reporte' })
  @IsString()
  @IsUUID()
  generatedById: string;
} 