import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTokenDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  type: string; // PROMOTIONAL_UNIT, SUBSCRIPTION_UNIT, CIRCULATING_UNIT, TEST_UNIT, TOIN

  @IsOptional()
  @IsString()
  status?: string; // ACTIVE, EXPIRED, USED, FROZEN

  @IsOptional()
  @IsDateString()
  caducityDate?: string;

  @IsString()
  source: string; // GIFT_CARD, PURCHASE, CONVERSION, REWARD, INITIAL_GRANT
} 