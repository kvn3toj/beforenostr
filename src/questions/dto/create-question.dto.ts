import {
  IsInt,
  IsString,
  IsIn,
  IsOptional,
  ValidateNested,
  ArrayNotEmpty,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnswerOptionDto {
  @ApiProperty({ description: 'The text of the answer option', type: String })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'Indicates if this option is the correct one', default: false })
  @IsOptional()
  @Type(() => Boolean)
  isCorrect?: boolean;

  @ApiPropertyOptional({ description: 'Display order of the option', default: 0 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  order?: number;
}

export class CreateQuestionDto {
  @ApiProperty({ description: 'The ID of the video item this question belongs to', type: Number })
  @IsInt()
  @Type(() => Number)
  videoItemId: number;

  @ApiProperty({ 
    description: 'The time in seconds where the question appears in the video',
    minimum: 0
  })
  @IsInt()
  @Type(() => Number)
  timestamp: number; // Tiempo de inicio en segundos

  @ApiPropertyOptional({ 
    description: 'The time in seconds where the question disappears from the video (optional)',
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  endTimestamp?: number; // Tiempo de fin en segundos (opcional)

  @ApiProperty({ 
    description: 'The type of question', 
    enum: ['multiple-choice', 'short-answer', 'true-false'],
    example: 'multiple-choice'
  })
  @IsString()
  @IsIn(['multiple-choice', 'short-answer', 'true-false'])
  type: 'multiple-choice' | 'short-answer' | 'true-false';

  @ApiProperty({ description: 'The text of the question', type: String })
  @IsString()
  text: string;

  @ApiProperty({ 
    description: 'The language code of the question (e.g., "es-ES", "en-US")',
    example: 'es-ES'
  })
  @IsString()
  languageCode: string;

  @ApiPropertyOptional({ description: 'Whether the question is active or not', default: true })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Answer options for multiple-choice questions (required for multiple-choice type)', 
    type: () => [CreateAnswerOptionDto],
    isArray: true
  })
  @ValidateIf(o => o.type === 'multiple-choice')
  @ArrayNotEmpty({ message: 'Multiple-choice questions must have at least one answer option.' })
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerOptionDto)
  answerOptions?: CreateAnswerOptionDto[];
} 