import { IsUUID, IsNumber, IsPositive, IsEnum, IsOptional, IsObject } from 'class-validator';

/**
 * SendTransactionDto asegura la claridad y la intención en el intercambio de valor,
 * fundamento de la Reciprocidad en CoomÜnity. Cada campo es validado para proteger
 * la integridad del flujo económico y la confianza entre los jugadores.
 */
export enum TransactionCurrency {
  UNITS = 'Ünits',
  MERITS = 'Mëritos',
}

export class SendTransactionDto {
  @IsUUID()
  recipientId: string;

  @IsNumber()
  @IsPositive({ message: 'El monto debe ser mayor a 0.' })
  amount: number;

  @IsEnum(TransactionCurrency, { message: 'La moneda debe ser Ünits o Mëritos.' })
  currency: TransactionCurrency;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>; // Metadata filosófica opcional
}
