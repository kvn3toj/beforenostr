/*
  Warnings:

  - The values [LUKAS,USD,EUR,BTC,ETH] on the enum `Currency` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CustomerJourneyStage" AS ENUM ('BUYER', 'SEEKER', 'SOLVER', 'PROMOTER');

-- AlterEnum
BEGIN;
CREATE TYPE "Currency_new" AS ENUM ('UNITS', 'TOINS', 'ONDAS', 'MERITOS');
ALTER TABLE "marketplace_items" ALTER COLUMN "currency" DROP DEFAULT;
ALTER TABLE "marketplace_items" ALTER COLUMN "currency" TYPE "Currency_new" USING ("currency"::text::"Currency_new");
ALTER TYPE "Currency" RENAME TO "Currency_old";
ALTER TYPE "Currency_new" RENAME TO "Currency";
DROP TYPE "Currency_old";
ALTER TABLE "marketplace_items" ALTER COLUMN "currency" SET DEFAULT 'UNITS';
COMMIT;

-- AlterTable
ALTER TABLE "marketplace_items" ALTER COLUMN "currency" SET DEFAULT 'UNITS';

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currentStage" TEXT NOT NULL DEFAULT 'BUYER',
ADD COLUMN     "stageCompletionData" JSONB,
ADD COLUMN     "stageProgressedAt" TIMESTAMP(3),
ADD COLUMN     "stageStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "stage_progressions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stage" "CustomerJourneyStage" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "requirements" JSONB NOT NULL,
    "metrics" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "stage_progressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage_requirements" (
    "id" TEXT NOT NULL,
    "stage" "CustomerJourneyStage" NOT NULL,
    "type" TEXT NOT NULL,
    "minValue" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stage_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stage_progressions_userId_idx" ON "stage_progressions"("userId");

-- CreateIndex
CREATE INDEX "stage_progressions_stage_idx" ON "stage_progressions"("stage");

-- CreateIndex
CREATE INDEX "stage_progressions_isActive_idx" ON "stage_progressions"("isActive");

-- CreateIndex
CREATE INDEX "stage_requirements_stage_idx" ON "stage_requirements"("stage");

-- CreateIndex
CREATE INDEX "stage_requirements_type_idx" ON "stage_requirements"("type");

-- AddForeignKey
ALTER TABLE "stage_progressions" ADD CONSTRAINT "stage_progressions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
