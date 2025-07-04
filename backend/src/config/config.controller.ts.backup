import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('config')
@Controller('config')
export class ConfigController {
  @Get('elemental-system')
  @ApiOperation({
    summary: 'Obtener configuración del sistema elemental CoomÜnity',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración elemental obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        fuego: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Fuego' },
            color: { type: 'string', example: '#FF6B35' },
            gradient: {
              type: 'string',
              example: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            },
            keyword: { type: 'string', example: 'Acción' },
            description: {
              type: 'string',
              example: 'Impulso transformador y energía creativa',
            },
            icon: { type: 'string', example: '🔥' },
          },
        },
        agua: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Agua' },
            color: { type: 'string', example: '#4ECDC4' },
            gradient: {
              type: 'string',
              example: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
            },
            keyword: { type: 'string', example: 'Fluidez' },
            description: {
              type: 'string',
              example: 'Adaptabilidad y sabiduría emocional',
            },
            icon: { type: 'string', example: '💧' },
          },
        },
        tierra: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Tierra' },
            color: { type: 'string', example: '#8FBC8F' },
            gradient: {
              type: 'string',
              example: 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)',
            },
            keyword: { type: 'string', example: 'Estabilidad' },
            description: {
              type: 'string',
              example: 'Fundamento sólido y crecimiento sostenible',
            },
            icon: { type: 'string', example: '🌱' },
          },
        },
        aire: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Aire' },
            color: { type: 'string', example: '#87CEEB' },
            gradient: {
              type: 'string',
              example: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
            },
            keyword: { type: 'string', example: 'Visión' },
            description: {
              type: 'string',
              example: 'Claridad mental y perspectiva elevada',
            },
            icon: { type: 'string', example: '🌬️' },
          },
        },
      },
    },
  })
  async getElementalSystemConfig() {
    // Configuración del sistema elemental CoomÜnity
    return {
      fuego: {
        name: 'Fuego',
        color: '#FF6B35',
        gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        keyword: 'Acción',
        description:
          'Impulso transformador y energía creativa que motiva el cambio positivo',
        icon: '🔥',
      },
      agua: {
        name: 'Agua',
        color: '#4ECDC4',
        gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
        keyword: 'Fluidez',
        description:
          'Adaptabilidad y sabiduría emocional para navegar los desafíos',
        icon: '💧',
      },
      tierra: {
        name: 'Tierra',
        color: '#8FBC8F',
        gradient: 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)',
        keyword: 'Estabilidad',
        description:
          'Fundamento sólido y crecimiento sostenible para la comunidad',
        icon: '🌱',
      },
      aire: {
        name: 'Aire',
        color: '#87CEEB',
        gradient: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
        keyword: 'Visión',
        description:
          'Claridad mental y perspectiva elevada hacia el Bien Común',
        icon: '🌬️',
      },
    };
  }
}
