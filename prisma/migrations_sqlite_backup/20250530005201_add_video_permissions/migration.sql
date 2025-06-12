-- CreateTable
CREATE TABLE "video_permissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoItemId" INTEGER NOT NULL,
    "showWaveCount" BOOLEAN NOT NULL DEFAULT true,
    "showVideos" BOOLEAN NOT NULL DEFAULT true,
    "showVideoSubtitles" BOOLEAN NOT NULL DEFAULT true,
    "showComments" BOOLEAN NOT NULL DEFAULT true,
    "showPublishDate" BOOLEAN NOT NULL DEFAULT true,
    "showVideoDuration" BOOLEAN NOT NULL DEFAULT true,
    "showLikeButton" BOOLEAN NOT NULL DEFAULT true,
    "allowRewindForward" BOOLEAN NOT NULL DEFAULT false,
    "allowViewComments" BOOLEAN NOT NULL DEFAULT true,
    "allowMakeComments" BOOLEAN NOT NULL DEFAULT true,
    "showLikeComments" BOOLEAN NOT NULL DEFAULT true,
    "sortCommentsByAffinity" BOOLEAN NOT NULL DEFAULT false,
    "showCommenterName" BOOLEAN NOT NULL DEFAULT false,
    "playlistPosition" TEXT NOT NULL DEFAULT 'position1',
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "video_permissions_videoItemId_fkey" FOREIGN KEY ("videoItemId") REFERENCES "video_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "video_permissions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "video_permissions_videoItemId_key" ON "video_permissions"("videoItemId");

-- CreateIndex
CREATE INDEX "video_permissions_videoItemId_idx" ON "video_permissions"("videoItemId");

-- CreateIndex
CREATE INDEX "video_permissions_isDraft_idx" ON "video_permissions"("isDraft");

-- CreateIndex
CREATE INDEX "video_permissions_createdById_idx" ON "video_permissions"("createdById");
