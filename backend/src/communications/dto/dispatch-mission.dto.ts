import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '../../generated/prisma';

export class DispatchMissionDto {
  @ApiProperty({
    description: 'Directiva o prompt para los agentes IA',
    example:
      'Investiga las 5 startups más innovadoras en economía circular en Latinoamérica y crea una imagen conceptual para cada una',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  mission: string;

  @ApiProperty({
    description: 'Tipo de misión a ejecutar',
    enum: $Enums.MissionType,
    example: $Enums.MissionType.COMPLEX,
    required: false,
  })
  @IsEnum($Enums.MissionType)
  @IsOptional()
  missionType?: $Enums.MissionType;

  @ApiProperty({
    description:
      'Agente específico a invocar (opcional, si no se especifica ANA decide)',
    enum: $Enums.AgentType,
    required: false,
  })
  @IsEnum($Enums.AgentType)
  @IsOptional()
  targetAgent?: $Enums.AgentType;

  @ApiProperty({
    description: 'Prioridad de la misión (1-5, siendo 5 la más alta)',
    example: 3,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  priority?: number;

  @ApiProperty({
    description: 'Contexto adicional para la misión',
    example:
      'Esta investigación es para el blog de CoomÜnity sobre innovación sostenible',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  context?: string;
}
