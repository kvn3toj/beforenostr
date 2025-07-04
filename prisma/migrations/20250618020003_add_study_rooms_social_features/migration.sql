-- CreateEnum
CREATE TYPE "StudyRoomStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');

-- CreateTable
CREATE TABLE "study_rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "videoId" INTEGER NOT NULL,
    "hostId" TEXT NOT NULL,
    "maxParticipants" INTEGER NOT NULL DEFAULT 10,
    "status" "StudyRoomStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_room_participants" (
    "id" TEXT NOT NULL,
    "studyRoomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "study_room_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_room_messages" (
    "id" TEXT NOT NULL,
    "studyRoomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'CHAT',
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_room_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "study_rooms_hostId_idx" ON "study_rooms"("hostId");

-- CreateIndex
CREATE INDEX "study_rooms_videoId_idx" ON "study_rooms"("videoId");

-- CreateIndex
CREATE INDEX "study_rooms_status_idx" ON "study_rooms"("status");

-- CreateIndex
CREATE INDEX "study_rooms_isActive_idx" ON "study_rooms"("isActive");

-- CreateIndex
CREATE INDEX "study_rooms_createdAt_idx" ON "study_rooms"("createdAt");

-- CreateIndex
CREATE INDEX "study_room_participants_studyRoomId_idx" ON "study_room_participants"("studyRoomId");

-- CreateIndex
CREATE INDEX "study_room_participants_userId_idx" ON "study_room_participants"("userId");

-- CreateIndex
CREATE INDEX "study_room_participants_isActive_idx" ON "study_room_participants"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "study_room_participants_studyRoomId_userId_key" ON "study_room_participants"("studyRoomId", "userId");

-- CreateIndex
CREATE INDEX "study_room_messages_studyRoomId_idx" ON "study_room_messages"("studyRoomId");

-- CreateIndex
CREATE INDEX "study_room_messages_userId_idx" ON "study_room_messages"("userId");

-- CreateIndex
CREATE INDEX "study_room_messages_messageType_idx" ON "study_room_messages"("messageType");

-- CreateIndex
CREATE INDEX "study_room_messages_createdAt_idx" ON "study_room_messages"("createdAt");

-- AddForeignKey
ALTER TABLE "study_rooms" ADD CONSTRAINT "study_rooms_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_rooms" ADD CONSTRAINT "study_rooms_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_room_participants" ADD CONSTRAINT "study_room_participants_studyRoomId_fkey" FOREIGN KEY ("studyRoomId") REFERENCES "study_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_room_participants" ADD CONSTRAINT "study_room_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_room_messages" ADD CONSTRAINT "study_room_messages_studyRoomId_fkey" FOREIGN KEY ("studyRoomId") REFERENCES "study_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_room_messages" ADD CONSTRAINT "study_room_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
