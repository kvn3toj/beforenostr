import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsEmail, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum InvitationStatus {
  SENT = 'SENT',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum UserInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED'
}

export class CreateInvitationTemplateDto {
  @IsString()
  name: string;

  @IsString()
  content: string; // JSON string para personalización

  @IsUUID()
  creatorId: string;
}

export class CreateGiftCardDto {
  @IsUUID()
  inviterId: string; // Solver Padre

  @IsString()
  invitedName: string;

  @IsEmail()
  invitedEmail: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  unitsAmount: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestions?: string[]; // Productos/servicios sugeridos

  @IsOptional()
  @IsUUID()
  templateId?: string; // Template de invitación a usar
}

export class RedeemGiftCardDto {
  @IsString()
  token: string; // Token único de la gift card

  @IsString()
  invitedName: string;

  @IsEmail()
  invitedEmail: string;

  @IsString()
  password: string; // Para crear la cuenta del usuario

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

export class UpdateGiftCardDto {
  @IsOptional()
  @IsEnum(InvitationStatus)
  status?: InvitationStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitsAmount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestions?: string[];
}

export class InvitationChallengeDto {
  @IsUUID()
  invitedUserId: string;

  @IsUUID()
  giftCardId: string;

  @IsString()
  challengeType: string; // 'INITIAL_CHAT', 'PWA_INSTALL', etc.
}

export class InvitationStatsDto {
  @IsOptional()
  @IsUUID()
  inviterId?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
} 