import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto, CreateAnswerOptionDto } from './create-question.dto';
import { IsInt, ValidateNested, IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO para actualizar una opción de respuesta existente
export class UpdateAnswerOptionDto extends PartialType(CreateAnswerOptionDto) {
  @ApiProperty({ description: 'The ID of the answer option to update' })
  @IsInt()
  @Type(() => Number)
  id: number; // ID de la opción a actualizar
}

// DTO para actualizar una pregunta
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @ApiPropertyOptional({ description: 'The ID of the video item this question belongs to' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  videoItemId?: number;

  @ApiPropertyOptional({ 
    description: 'The time in seconds where the question appears in the video',
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  timestamp?: number; // Tiempo de inicio en segundos

  @ApiPropertyOptional({ 
    description: 'The time in seconds where the question disappears from the video (optional)',
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  endTimestamp?: number; // Tiempo de fin en segundos (opcional)

  @ApiPropertyOptional({ 
    description: 'The type of question', 
    enum: ['multiple-choice', 'short-answer', 'true-false'],
    example: 'multiple-choice'
  })
  @IsOptional()
  @IsString()
  @IsIn(['multiple-choice', 'short-answer', 'true-false'])
  type?: 'multiple-choice' | 'short-answer' | 'true-false';

  @ApiPropertyOptional({ description: 'The text of the question' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ 
    description: 'The language code of the question (e.g., "es-ES", "en-US")',
    example: 'es-ES'
  })
  @IsOptional()
  @IsString()
  languageCode?: string;

  @ApiPropertyOptional({ description: 'Whether the question is active or not' })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Answer options for multiple-choice questions', 
    type: [UpdateAnswerOptionDto],
    isArray: true
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerOptionDto)
  answerOptions?: UpdateAnswerOptionDto[];
} 