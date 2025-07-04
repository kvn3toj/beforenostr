import { IsString, IsOptional, IsObject, IsUUID } from 'class-validator';

export class CreateUserEngagementDto {
  @IsString()
  @IsOptional()
  @IsUUID() // Assuming contentItemId is a UUID
  contentItemId?: string;

  @IsString()
  @IsOptional()
  @IsUUID() // Assuming challengeId is a UUID
  challengeId?: string;

  @IsString()
  eventType: string;

  @IsObject()
  @IsOptional()
  eventData?: Record<string, unknown>; // Use 'any' or a more specific interface/class if available
}
