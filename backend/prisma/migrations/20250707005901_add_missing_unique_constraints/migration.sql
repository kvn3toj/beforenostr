/*
  Warnings:

  - You are about to drop the column `status` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `currentStage` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stageCompletionData` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stageProgressedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stageStartedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `balanceToins` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `balanceUnits` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `blockchainAddress` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `wallets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `marketplace_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `mundos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mundoId,name]` on the table `playlists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,stage]` on the table `stage_progressions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `video_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currency` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transaction_from_wallet_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transaction_to_wallet_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_userId_fkey";

-- DropIndex
DROP INDEX "transactions_status_idx";

-- DropIndex
DROP INDEX "transactions_type_idx";

-- DropIndex
DROP INDEX "wallets_blockchainAddress_idx";

-- DropIndex
DROP INDEX "wallets_blockchainAddress_key";

-- DropIndex
DROP INDEX "wallets_status_idx";

-- DropIndex
DROP INDEX "wallets_userId_idx";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "status",
DROP COLUMN "tokenType",
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "currentStage",
DROP COLUMN "stageCompletionData",
DROP COLUMN "stageProgressedAt",
DROP COLUMN "stageStartedAt";

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "balanceToins",
DROP COLUMN "balanceUnits",
DROP COLUMN "blockchainAddress",
DROP COLUMN "status",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "lastTransaction" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_items_name_key" ON "marketplace_items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mundos_name_key" ON "mundos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "playlists_mundoId_name_key" ON "playlists"("mundoId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "stage_progressions_userId_stage_key" ON "stage_progressions"("userId", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "video_items_title_key" ON "video_items"("title");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "transactions_fromUserId_idx" RENAME TO "transaction_from_user_id_idx";

-- RenameIndex
ALTER INDEX "transactions_toUserId_idx" RENAME TO "transaction_to_user_id_idx";
