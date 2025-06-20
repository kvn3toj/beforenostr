-- AlterTable
ALTER TABLE "questions" ADD COLUMN "endTimestamp" INTEGER;

-- CreateIndex
CREATE INDEX "questions_endTimestamp_idx" ON "questions"("endTimestamp");
