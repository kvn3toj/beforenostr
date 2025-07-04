import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTOs para las operaciones de IA de CoomÜnity
 * Purificación alquímica de SAGE: eliminando 'any' por tipos explícitos
 * Alineados con las interfaces existentes en QuestionGeneratorService
 */

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple-choice',
  TRUE_FALSE = 'true-false',
  SHORT_ANSWER = 'short-answer',
}

export enum FocusContext {
  GENERAL = 'general',
  VISUAL = 'visual',
  AUDIO = 'audio',
  SPECIFIC_MOMENTS = 'specific_moments',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum TimeDistribution {
  BEGINNING = 'beginning',
  MIDDLE = 'middle',
  END = 'end',
  DISTRIBUTED = 'distributed',
}

export class GenerateQuestionsDto {
  @ApiProperty({
    description: 'ID del video item para el cual generar preguntas',
    example: 123,
  })
  @IsNumber()
  @Type(() => Number)
  videoItemId: number;

  @ApiPropertyOptional({
    description: 'Número de preguntas a generar',
    example: 2,
    default: 2,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  numberOfQuestions?: number;

  @ApiPropertyOptional({
    description: 'Contexto de enfoque para las preguntas',
    enum: FocusContext,
    example: FocusContext.GENERAL,
    default: FocusContext.GENERAL,
  })
  @IsOptional()
  @IsEnum(FocusContext)
  focusContext?: FocusContext;

  @ApiPropertyOptional({
    description: 'Tipos de preguntas a generar',
    type: [String],
    enum: QuestionType,
    example: [QuestionType.MULTIPLE_CHOICE],
    default: [QuestionType.MULTIPLE_CHOICE],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(QuestionType, { each: true })
  questionTypes?: QuestionType[];

  @ApiPropertyOptional({
    description: 'Distribución temporal de las preguntas',
    enum: TimeDistribution,
    example: TimeDistribution.DISTRIBUTED,
    default: TimeDistribution.DISTRIBUTED,
  })
  @IsOptional()
  @IsEnum(TimeDistribution)
  timeDistribution?: TimeDistribution;

  @ApiPropertyOptional({
    description: 'Nivel de dificultad de las preguntas',
    enum: DifficultyLevel,
    example: DifficultyLevel.MEDIUM,
    default: DifficultyLevel.MEDIUM,
  })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficultyLevel?: DifficultyLevel;

  @ApiPropertyOptional({
    description: 'Código de idioma para las preguntas',
    example: 'es-ES',
    default: 'es-ES',
  })
  @IsOptional()
  @IsString()
  languageCode?: string;

  @ApiPropertyOptional({
    description: 'Si debe auto-guardar las preguntas generadas',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoSave?: boolean;
}

/**
 * Estructura de pregunta que coincide con GeneratedQuestion del servicio
 */
export interface SavedQuestionData {
  timestamp: number;
  endTimestamp?: number;
  type: string;
  text: string;
  options?: string[];
  correctAnswer?: number | string;
  explanation?: string;
}

export class SaveQuestionsDto {
  @ApiProperty({
    description: 'ID del video item',
    example: 123,
  })
  @IsNumber()
  @Type(() => Number)
  videoItemId: number;

  @ApiProperty({
    description: 'Array de preguntas a guardar',
    type: 'array',
    example: [
      {
        timestamp: 120,
        type: 'multiple-choice',
        text: '¿Cuál es el mensaje principal del video?',
        options: ['Opción A', 'Opción B', 'Opción C'],
        correctAnswer: 0,
        explanation: 'Se menciona claramente en los subtítulos',
      },
    ],
  })
  @IsArray()
  questions: SavedQuestionData[];

  @ApiProperty({
    description: 'Código de idioma',
    example: 'es-ES',
  })
  @IsString()
  languageCode: string;
}
