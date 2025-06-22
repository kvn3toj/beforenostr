import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsEmail, IsArray, Min, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum InvitationStatus {
  SENT = 'SENT',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum UserInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export class CreateInvitationTemplateDto {
  @ApiProperty({ description: 'Nombre del template' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Asunto del email' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Contenido HTML del template' })
  @IsString()
  htmlContent: string;

  @ApiProperty({ description: 'Contenido de texto plano' })
  @IsString()
  textContent: string;

  @ApiProperty({ description: 'Variables disponibles en el template', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @ApiProperty({ description: 'Si el template está activo', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  creatorId: string;
}

export class CreateGiftCardDto {
  @ApiProperty({ description: 'ID del usuario que invita' })
  @IsString()
  inviterId: string;

  @ApiProperty({ description: 'Nombre del invitado' })
  @IsString()
  invitedName: string;

  @ApiProperty({ description: 'Email del invitado' })
  @IsEmail()
  invitedEmail: string;

  @ApiProperty({ description: 'Cantidad de Ünits a regalar' })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  unitsAmount: number;

  @ApiProperty({ description: 'Sugerencias para el invitado', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestions?: string[];

  @ApiProperty({ description: 'ID del template de invitación', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;
}

export class RedeemGiftCardDto {
  @ApiProperty({ description: 'Token de la gift card' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Email del invitado' })
  @IsEmail()
  invitedEmail: string;

  @ApiProperty({ description: 'Contraseña para la nueva cuenta' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Nombre del invitado' })
  @IsString()
  invitedName: string;

  @ApiProperty({ description: 'Primer nombre', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Apellido', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class UpdateGiftCardDto {
  @ApiProperty({ description: 'Nuevo nombre del invitado', required: false })
  @IsOptional()
  @IsString()
  invitedName?: string;

  @ApiProperty({ description: 'Nuevo email del invitado', required: false })
  @IsOptional()
  @IsEmail()
  invitedEmail?: string;

  @ApiProperty({ description: 'Nueva cantidad de Ünits', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitsAmount?: number;

  @ApiProperty({ description: 'Nuevas sugerencias', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestions?: string[];
}

export class InvitationChallengeDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Tipo de challenge' })
  @IsString()
  challengeType: string;

  @ApiProperty({ description: 'Objetivo del challenge' })
  @IsNumber()
  target: number;

  @ApiProperty({ description: 'Recompensa por completar el challenge' })
  @IsNumber()
  reward: number;

  @ApiProperty({ description: 'Fecha límite del challenge', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class InvitationStatsDto {
  @ApiProperty({ description: 'ID del usuario para filtrar estadísticas', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Fecha de inicio para el rango', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Fecha de fin para el rango', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
