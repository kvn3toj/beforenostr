import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { FeedbackStatus } from '../../generated/prisma';

export class UpdateFeedbackDto {
  @IsOptional()
  @IsEnum(FeedbackStatus)
  status?: FeedbackStatus;

  @IsOptional()
  @IsString()
  adminResponse?: string;

  @IsOptional()
  @IsObject()
  codeAnalysis?: any;

  @IsOptional()
  @IsObject()
  aiSuggestions?: any;
}
