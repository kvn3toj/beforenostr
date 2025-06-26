/*
  Warnings:

  - You are about to drop the `MarketplaceItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "MarketplaceItem" DROP CONSTRAINT "MarketplaceItem_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_marketplaceItemId_fkey";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "avatar" TEXT;

-- DropTable
DROP TABLE "MarketplaceItem";

-- CreateTable
CREATE TABLE "marketplace_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fullDescription" TEXT,
    "itemType" "MarketplaceItemType" NOT NULL DEFAULT 'SERVICE',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceToins" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'LUKAS',
    "category" TEXT,
    "tags" TEXT[],
    "images" TEXT[],
    "stock" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "status" "MarketplaceItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "sellerId" TEXT NOT NULL,
    "metadata" TEXT,

    CONSTRAINT "marketplace_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_matches" (
    "id" TEXT NOT NULL,
    "marketplaceItemId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "sellerConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_messages" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketplace_items_sellerId_idx" ON "marketplace_items"("sellerId");

-- CreateIndex
CREATE INDEX "marketplace_items_status_idx" ON "marketplace_items"("status");

-- CreateIndex
CREATE INDEX "marketplace_items_isActive_idx" ON "marketplace_items"("isActive");

-- CreateIndex
CREATE INDEX "marketplace_items_isDeleted_idx" ON "marketplace_items"("isDeleted");

-- CreateIndex
CREATE INDEX "marketplace_items_createdAt_idx" ON "marketplace_items"("createdAt");

-- CreateIndex
CREATE INDEX "marketplace_items_updatedAt_idx" ON "marketplace_items"("updatedAt");

-- CreateIndex
CREATE INDEX "marketplace_items_viewCount_idx" ON "marketplace_items"("viewCount");

-- CreateIndex
CREATE INDEX "marketplace_items_favoriteCount_idx" ON "marketplace_items"("favoriteCount");

-- CreateIndex
CREATE INDEX "marketplace_items_itemType_idx" ON "marketplace_items"("itemType");

-- CreateIndex
CREATE INDEX "marketplace_items_price_idx" ON "marketplace_items"("price");

-- CreateIndex
CREATE INDEX "marketplace_items_priceToins_idx" ON "marketplace_items"("priceToins");

-- CreateIndex
CREATE INDEX "marketplace_items_currency_idx" ON "marketplace_items"("currency");

-- CreateIndex
CREATE INDEX "marketplace_items_category_idx" ON "marketplace_items"("category");

-- CreateIndex
CREATE INDEX "marketplace_items_location_idx" ON "marketplace_items"("location");

-- CreateIndex
CREATE INDEX "marketplace_matches_marketplaceItemId_idx" ON "marketplace_matches"("marketplaceItemId");

-- CreateIndex
CREATE INDEX "marketplace_matches_buyerId_idx" ON "marketplace_matches"("buyerId");

-- CreateIndex
CREATE INDEX "marketplace_matches_sellerId_idx" ON "marketplace_matches"("sellerId");

-- CreateIndex
CREATE INDEX "match_messages_matchId_idx" ON "match_messages"("matchId");

-- CreateIndex
CREATE INDEX "match_messages_senderId_idx" ON "match_messages"("senderId");

-- AddForeignKey
ALTER TABLE "marketplace_items" ADD CONSTRAINT "marketplace_items_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_marketplaceItemId_fkey" FOREIGN KEY ("marketplaceItemId") REFERENCES "marketplace_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_matches" ADD CONSTRAINT "marketplace_matches_marketplaceItemId_fkey" FOREIGN KEY ("marketplaceItemId") REFERENCES "marketplace_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_matches" ADD CONSTRAINT "marketplace_matches_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_matches" ADD CONSTRAINT "marketplace_matches_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_messages" ADD CONSTRAINT "match_messages_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "marketplace_matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_messages" ADD CONSTRAINT "match_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
