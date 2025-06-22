import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum FocusContext {
  GENERAL = 'general',
  VISUAL = 'visual',
  AUDIO = 'audio',
  SPECIFIC_MOMENTS = 'specific_moments',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple-choice',
  TRUE_FALSE = 'true-false',
  SHORT_ANSWER = 'short-answer',
}

export enum TimeDistribution {
  BEGINNING = 'beginning',
  MIDDLE = 'middle',
  END = 'end',
  DISTRIBUTED = 'distributed',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export class GenerateQuestionsDto {
  @ApiProperty({
    description: 'ID of the video item to generate questions for',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  videoItemId: number;

  @ApiProperty({
    description: 'Number of questions to generate',
    example: 3,
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  numberOfQuestions: number;

  @ApiProperty({
    description: 'Focus context for the questions',
    enum: FocusContext,
    example: FocusContext.GENERAL,
  })
  @IsEnum(FocusContext)
  focusContext: FocusContext;

  @ApiProperty({
    description: 'Types of questions to generate',
    enum: QuestionType,
    isArray: true,
    example: [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE],
  })
  @IsArray()
  @IsEnum(QuestionType, { each: true })
  questionTypes: QuestionType[];

  @ApiProperty({
    description: 'How to distribute questions across the video timeline',
    enum: TimeDistribution,
    example: TimeDistribution.DISTRIBUTED,
  })
  @IsEnum(TimeDistribution)
  timeDistribution: TimeDistribution;

  @ApiProperty({
    description: 'Difficulty level of the questions',
    enum: DifficultyLevel,
    example: DifficultyLevel.MEDIUM,
  })
  @IsEnum(DifficultyLevel)
  difficultyLevel: DifficultyLevel;

  @ApiProperty({
    description: 'Language code for the questions',
    example: 'es-ES',
  })
  @IsString()
  languageCode: string;

  @ApiProperty({
    description: 'Whether to save the generated questions automatically',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  autoSave?: boolean = false;
}
