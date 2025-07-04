import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMeritDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  type: string; // MERITO, ONDA, VIBRA

  @IsString()
  source: string; // INTERACTION, CONTRIBUTION, INVITATION_PERFORMANCE, CHALLENGE_COMPLETION, COMMUNITY_PARTICIPATION, CONTENT_CREATION

  @IsOptional()
  @IsString()
  relatedEntityId?: string; // ID de la entidad relacionada (activityId, transactionId, etc.)
}
