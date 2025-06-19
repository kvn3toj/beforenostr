import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum LetsTransactionType {
  EXCHANGE = 'EXCHANGE',
  CONVERSION = 'CONVERSION',
  EXPIRY_CHECK = 'EXPIRY_CHECK',
  BALANCE_ADJUSTMENT = 'BALANCE_ADJUSTMENT'
}

export enum LetsTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

export class CreateLetsTransactionDto {
  @IsUUID()
  fromUserId: string;

  @IsUUID()
  toUserId: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsEnum(LetsTransactionType)
  type: LetsTransactionType;

  @IsOptional()
  @IsString()
  description?: string;
}

export class LetsBalanceDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  tokenType?: string; // PROMOTIONAL_UNIT, SUBSCRIPTION_UNIT, CIRCULATING_UNIT
}

export class LetsExpiryCheckDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  tokenType?: string;
}

export class LetsExchangeRateDto {
  @IsString()
  fromTokenType: string;

  @IsString()
  toTokenType: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  rate: number;
} 