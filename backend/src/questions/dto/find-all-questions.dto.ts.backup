import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllQuestionsDto {
  @ApiProperty({ description: 'Filter questions by video item ID' })
  @IsInt()
  @Type(() => Number)
  videoItemId: number; // Requerido para filtrar preguntas por video

  @ApiPropertyOptional({
    description: 'Filter questions by language code',
    example: 'es-ES',
  })
  @IsOptional()
  @IsString()
  languageCode?: string;

  @ApiPropertyOptional({
    description: 'Filter questions by type',
    enum: ['multiple-choice', 'short-answer', 'true-false'],
    example: 'multiple-choice',
  })
  @IsOptional()
  @IsString()
  @IsIn(['multiple-choice', 'short-answer', 'true-false'])
  type?: 'multiple-choice' | 'short-answer' | 'true-false';

  @ApiPropertyOptional({
    description: 'Filter questions by active status',
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
