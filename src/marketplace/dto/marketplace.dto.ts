import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum MarketplaceItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  EXPERIENCE = 'EXPERIENCE',
  SKILL_EXCHANGE = 'SKILL_EXCHANGE'
}

export enum MarketplaceItemStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED'
}

export class CreateMarketplaceItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(MarketplaceItemType)
  type: MarketplaceItemType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceUnits: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceToins?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsUUID()
  sellerId: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  metadata?: any; // JSON para datos específicos del tipo de item
}

export class UpdateMarketplaceItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceUnits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceToins?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(MarketplaceItemStatus)
  status?: MarketplaceItemStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  metadata?: any;
}

export class MarketplaceSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(MarketplaceItemType)
  type?: MarketplaceItemType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  offset?: string;
}

export class CreateMarketplaceOfferDto {
  @IsUUID()
  itemId: string;

  @IsUUID()
  buyerId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offeredPriceUnits: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offeredPriceToins?: number;

  @IsOptional()
  @IsString()
  message?: string;
} 