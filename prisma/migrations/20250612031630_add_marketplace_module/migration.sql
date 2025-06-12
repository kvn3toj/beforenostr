-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('LUKAS', 'USD', 'EUR', 'BTC', 'ETH');

-- CreateEnum
CREATE TYPE "MarketplaceItemType" AS ENUM ('PRODUCT', 'SERVICE', 'EXPERIENCE', 'SKILL_EXCHANGE', 'DIGITAL_CONTENT');

-- CreateEnum
CREATE TYPE "MarketplaceItemStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'SOLD', 'EXPIRED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "marketplace_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'LUKAS',
    "itemType" "MarketplaceItemType" NOT NULL DEFAULT 'SERVICE',
    "status" "MarketplaceItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "images" TEXT[],
    "tags" TEXT[],
    "location" TEXT,
    "metadata" TEXT,
    "priceToins" DOUBLE PRECISION DEFAULT 0,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "marketplace_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketplace_items_sellerId_idx" ON "marketplace_items"("sellerId");

-- CreateIndex
CREATE INDEX "marketplace_items_itemType_idx" ON "marketplace_items"("itemType");

-- CreateIndex
CREATE INDEX "marketplace_items_status_idx" ON "marketplace_items"("status");

-- CreateIndex
CREATE INDEX "marketplace_items_currency_idx" ON "marketplace_items"("currency");

-- CreateIndex
CREATE INDEX "marketplace_items_isActive_idx" ON "marketplace_items"("isActive");

-- CreateIndex
CREATE INDEX "marketplace_items_isDeleted_idx" ON "marketplace_items"("isDeleted");

-- CreateIndex
CREATE INDEX "marketplace_items_createdAt_idx" ON "marketplace_items"("createdAt");

-- CreateIndex
CREATE INDEX "marketplace_items_price_idx" ON "marketplace_items"("price");

-- CreateIndex
CREATE INDEX "marketplace_items_location_idx" ON "marketplace_items"("location");

-- AddForeignKey
ALTER TABLE "marketplace_items" ADD CONSTRAINT "marketplace_items_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
