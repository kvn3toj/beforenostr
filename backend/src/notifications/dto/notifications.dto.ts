import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsUUID,
  IsArray,
} from 'class-validator';

export enum NotificationType {
  NEW_PUBLICATION = 'NEW_PUBLICATION',
  MERIT_AWARDED = 'MERIT_AWARDED',
  CHALLENGE_ALERT = 'CHALLENGE_ALERT',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  GROUP_INVITATION = 'GROUP_INVITATION',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  EXPERIENCE_COMPLETED = 'EXPERIENCE_COMPLETED',
  TOKEN_EXPIRY_WARNING = 'TOKEN_EXPIRY_WARNING',
  MARKETPLACE_UPDATE = 'MARKETPLACE_UPDATE',
}

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  relatedEntityId?: string; // ID de la entidad relacionada (publicación, transacción, etc.)

  @IsOptional()
  metadata?: Record<string, unknown>; // Datos adicionales en formato JSON
}

export class CreateBulkNotificationDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  userIds: string[];

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  relatedEntityId?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}

export class NotificationFilterDto {
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  offset?: string;
}
