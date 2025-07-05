import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { FeedbackStatus } from '../../generated/prisma.js.js';

export class UpdateFeedbackDto {
  @IsOptional()
  @IsEnum(FeedbackStatus)
  status?: FeedbackStatus;

  @IsOptional()
  @IsString()
  adminResponse?: string;

  @IsOptional()
  @IsObject()
  codeAnalysis?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  aiSuggestions?: Record<string, unknown>;
}
