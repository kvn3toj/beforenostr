-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('RESEARCH', 'MEDIA_CREATION', 'PUBLICATION', 'NOTIFICATION', 'COMPLEX');

-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('ANA', 'NIRA', 'ARIA', 'HERALDO', 'PAX');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('PENDING', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ai_missions" (
    "id" TEXT NOT NULL,
    "missionType" "MissionType" NOT NULL,
    "primaryAgent" "AgentType" NOT NULL,
    "involvedAgents" "AgentType"[],
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "context" JSONB,
    "status" "MissionStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "estimatedDuration" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "results" JSONB,
    "outputs" JSONB,
    "errorMessage" TEXT,
    "n8nWorkflowId" TEXT,
    "n8nExecutionId" TEXT,
    "webhookResponse" JSONB,
    "qualityScore" DOUBLE PRECISION,
    "userFeedback" TEXT,
    "costEstimate" DOUBLE PRECISION,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_missions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_missions_status_idx" ON "ai_missions"("status");

-- CreateIndex
CREATE INDEX "ai_missions_missionType_idx" ON "ai_missions"("missionType");

-- CreateIndex
CREATE INDEX "ai_missions_primaryAgent_idx" ON "ai_missions"("primaryAgent");

-- CreateIndex
CREATE INDEX "ai_missions_createdBy_idx" ON "ai_missions"("createdBy");

-- CreateIndex
CREATE INDEX "ai_missions_createdAt_idx" ON "ai_missions"("createdAt");

-- CreateIndex
CREATE INDEX "ai_missions_completedAt_idx" ON "ai_missions"("completedAt");

-- AddForeignKey
ALTER TABLE "ai_missions" ADD CONSTRAINT "ai_missions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
