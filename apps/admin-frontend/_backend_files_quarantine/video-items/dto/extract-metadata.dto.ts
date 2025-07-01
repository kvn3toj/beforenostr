import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ExtractMetadataDto {
  @ApiProperty({ 
    description: 'Contenido del video (URL o JSON con información del video)',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class MetadataResponseDto {
  @ApiProperty({ 
    description: 'Plataforma detectada del video',
    example: 'youtube',
    type: String
  })
  detectedPlatform: string;

  @ApiProperty({ 
    description: 'Identificador único del video en la plataforma', 
    required: false,
    example: 'dQw4w9WgXcQ',
    type: String
  })
  platformVideoId?: string;

  @ApiProperty({ 
    description: 'URL completa del contenido de video', 
    required: false,
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: String
  })
  videoUrl?: string;

  @ApiProperty({ 
    description: 'URL de la imagen de vista previa', 
    required: false,
    example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    type: String
  })
  previewImageUrl?: string;

  @ApiProperty({ 
    description: 'Código de idioma del contenido', 
    required: false,
    example: 'en',
    type: String
  })
  contentLanguage?: string;

  @ApiProperty({ 
    description: 'Etiquetas del contenido', 
    required: false,
    example: '["music", "pop", "80s"]',
    type: String
  })
  contentTags?: string;

  @ApiProperty({ 
    description: 'Categorías del contenido', 
    required: false,
    example: '["Entertainment", "Music"]',
    type: String
  })
  contentCategories?: string;

  @ApiProperty({ 
    description: 'Información de calidad del video', 
    required: false,
    example: '{"resolution": "1080p", "aspectRatio": "16:9"}',
    type: String
  })
  videoQuality?: string;

  @ApiProperty({ 
    description: 'Duración en segundos', 
    required: false,
    example: 212,
    type: Number
  })
  videoDuration?: number;

  @ApiProperty({ 
    description: 'Título extraído del video', 
    required: false,
    example: 'Rick Astley - Never Gonna Give You Up',
    type: String
  })
  extractedTitle?: string;

  @ApiProperty({ 
    description: 'Descripción extraída del video', 
    required: false,
    example: 'Official video for Never Gonna Give You Up',
    type: String
  })
  extractedDescription?: string;

  @ApiProperty({ 
    description: 'Indica si la extracción fue exitosa',
    example: true,
    type: Boolean
  })
  extractionSuccess: boolean;

  @ApiProperty({ 
    description: 'Mensaje de error si la extracción falló', 
    required: false,
    example: 'Video not found',
    type: String
  })
  extractionError?: string;
} 