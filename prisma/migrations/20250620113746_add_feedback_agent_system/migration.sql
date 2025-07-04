-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('BUG', 'IMPROVEMENT', 'MISSING_FEATURE', 'PERFORMANCE', 'UX_ISSUE', 'CODE_ANALYSIS');

-- CreateEnum
CREATE TYPE "FeedbackPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('SUBMITTED', 'REVIEWING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'DUPLICATE');

-- CreateTable
CREATE TABLE "feedback_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "FeedbackPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'SUBMITTED',
    "elementContext" JSONB NOT NULL,
    "technicalContext" JSONB NOT NULL,
    "codeAnalysis" JSONB,
    "aiSuggestions" JSONB,
    "adminResponse" TEXT,
    "adminUserId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "duplicateOf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_reports_userId_idx" ON "feedback_reports"("userId");

-- CreateIndex
CREATE INDEX "feedback_reports_type_idx" ON "feedback_reports"("type");

-- CreateIndex
CREATE INDEX "feedback_reports_status_idx" ON "feedback_reports"("status");

-- CreateIndex
CREATE INDEX "feedback_reports_priority_idx" ON "feedback_reports"("priority");

-- CreateIndex
CREATE INDEX "feedback_reports_createdAt_idx" ON "feedback_reports"("createdAt");

-- AddForeignKey
ALTER TABLE "feedback_reports" ADD CONSTRAINT "feedback_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_reports" ADD CONSTRAINT "feedback_reports_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
