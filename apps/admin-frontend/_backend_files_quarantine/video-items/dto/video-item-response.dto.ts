import { ApiProperty } from '@nestjs/swagger';

export class VideoItemResponseDto {
  @ApiProperty({ description: 'ID único del video item', type: Number })
  id: number;

  @ApiProperty({ description: 'Título del video', type: String })
  title: string;

  @ApiProperty({ description: 'Descripción del video', required: false, type: String })
  description?: string;

  @ApiProperty({ description: 'Contenido del video (HTML/JSON)', type: String })
  content: string;

  @ApiProperty({ description: 'URL original del video', required: false, type: String })
  url?: string;

  @ApiProperty({ 
    description: 'Plataforma del video', 
    example: 'youtube',
    type: String
  })
  platform: string;

  @ApiProperty({ description: 'ID externo de la plataforma', required: false, type: String })
  externalId?: string;

  @ApiProperty({ description: 'Duración en segundos', required: false, type: Number })
  duration?: number;

  @ApiProperty({ description: 'URL de la imagen miniatura', required: false, type: String })
  thumbnailUrl?: string;

  @ApiProperty({ description: 'ID del playlist al que pertenece', type: Number })
  playlistId: number;

  @ApiProperty({ description: 'ID del tipo de item', required: false, type: Number })
  itemTypeId?: number;

  @ApiProperty({ 
    description: 'Tags del video (array de strings)', 
    type: [String],
    required: false 
  })
  tags?: string[];

  @ApiProperty({ 
    description: 'Categorías del video (array de strings)', 
    type: [String],
    required: false 
  })
  categories?: string[];

  @ApiProperty({ 
    description: 'Información de calidad del video', 
    type: 'object',
    required: false 
  })
  quality?: Record<string, any>;

  @ApiProperty({ description: 'Fecha de creación', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', type: Date })
  updatedAt: Date;

  @ApiProperty({ description: 'Fecha de eliminación (soft delete)', required: false, type: Date })
  deletedAt?: Date;
} 