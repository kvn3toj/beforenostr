import {
  IsUUID,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsObject,
  IsString,
} from 'class-validator';
import { Currency } from '../../../generated/prisma';
import { Transform } from 'class-transformer';

/**
 * Tipos específicos para metadata de transacciones alquímicamente purificada
 */
type MetadataValue = string | number | boolean | null;

/**
 * SendTransactionDto asegura la claridad y la intención en el intercambio de valor,
 * fundamento de la Reciprocidad en CoomÜnity. Cada campo es validado para proteger
 * la integridad del flujo económico y la confianza entre los jugadores.
 */
export enum TransactionCurrency {
  UNITS = 'Ünits',
  MERITS = 'Mëritos',
}

export const TRANSACTION_CURRENCY_TO_CURRENCY_MAP: Record<TransactionCurrency, Currency> = {
  [TransactionCurrency.UNITS]: Currency.UNITS,
  [TransactionCurrency.MERITS]: Currency.MERITOS,
};

export class SendTransactionDto {
  @IsUUID()
  recipientId: string;

  @IsNumber()
  @IsPositive({ message: 'El monto debe ser mayor a 0.' })
  amount: number;

  @IsEnum(TransactionCurrency, {
    message: 'La moneda debe ser Ünits o Mëritos.',
  })
  currency: TransactionCurrency;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, MetadataValue>; // Metadata filosófica opcional con tipos específicos
}

export class TransactionResponseDto {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: Currency;
  description?: string;
  @Transform(({ value }) => {
    if (!value) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  metadata?: Record<string, MetadataValue>;
  createdAt: Date;
  updatedAt: Date;
  fromUser?: {
    id: string;
    name?: string;
    email: string;
    avatarUrl?: string;
  };
  toUser?: {
    id: string;
    name?: string;
    email: string;
    avatarUrl?: string;
  };
}

export class TransactionStatsDto {
  totalSent: number;
  totalReceived: number;
  transactionCount: number;
  currencyBreakdown: Record<Currency, { sent: number; received: number }>;
}
