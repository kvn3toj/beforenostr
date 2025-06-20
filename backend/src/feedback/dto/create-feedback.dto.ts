import { IsString, IsEnum, IsNotEmpty, IsOptional, IsObject, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { FeedbackType, FeedbackPriority } from '../../generated/prisma';

export class ElementContextDto {
  @IsString()
  tagName: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  className?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsObject()
  position: { x: number; y: number };

  @IsString()
  url: string;

  @IsString()
  userAgent: string;

  @IsObject()
  viewport: { width: number; height: number };

  @IsString()
  timestamp: string;
}

export class TechnicalContextDto {
  @IsString()
  route: string;

  @IsString()
  userId: string;

  @IsString({ each: true })
  userRoles: string[];

  @IsString()
  sessionId: string;

  @IsString()
  buildVersion: string;
}

export class CreateFeedbackDto {
  @IsEnum(FeedbackType)
  type: FeedbackType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(FeedbackPriority)
  priority: FeedbackPriority;

  @IsString()
  category: string;

  @ValidateNested()
  @Type(() => ElementContextDto)
  elementContext: ElementContextDto;

  @ValidateNested()
  @Type(() => TechnicalContextDto)
  technicalContext: TechnicalContextDto;

  @IsOptional()
  @IsBoolean()
  requestCodeAnalysis?: boolean;
}
