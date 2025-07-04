/*
  Warnings:

  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transaction_from_user_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transaction_from_wallet_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transaction_to_user_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transaction_to_wallet_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_userId_fkey";

-- DropIndex
DROP INDEX "wallets_blockchainAddress_idx";

-- DropIndex
DROP INDEX "wallets_blockchainAddress_key";

-- DropIndex
DROP INDEX "wallets_status_idx";

-- DropIndex
DROP INDEX "wallets_userId_idx";

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "lastTransaction" TIMESTAMP(3);

-- DropTable
DROP TABLE "transactions";

-- CreateTable
CREATE TABLE "Transaction" (
    "_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "description" TEXT,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "fromWalletId" TEXT NOT NULL,
    "toWalletId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromWalletId_fkey" FOREIGN KEY ("fromWalletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
